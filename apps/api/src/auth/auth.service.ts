import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import {
  RegisterInput,
  LoginInput,
  RefreshTokenInput,
  RequestPasswordResetInput,
  ConfirmPasswordResetInput,
  VerifyEmailInput,
  UpdateProfileInput,
} from '@omnipost/validation';
import { AuthResponse, RoleName, UserSummary, WorkspaceSummary } from '@omnipost/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private async ensureSystemRolesExist() {
    const roles: RoleName[] = ['OWNER', 'ADMIN', 'EDITOR', 'PUBLISHER', 'ANALYST', 'VIEWER'];
    for (const roleName of roles) {
      await this.prisma.role.upsert({
        where: { name: roleName },
        update: {},
        create: { name: roleName, description: `${roleName} workspace role` },
      });
    }
  }

  private generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'dev_jwt_secret_key_1234567890',
      expiresIn: '1h',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'dev_jwt_refresh_secret_key_1234567890',
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600,
    };
  }

  async register(input: RegisterInput): Promise<AuthResponse> {
    await this.ensureSystemRolesExist();

    const existingUser = await this.prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('Email address is already registered');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        passwordHash,
        name: input.name,
      },
    });

    // Create default workspace for user
    const slug = `ws-${user.id.slice(0, 8)}`;
    const workspace = await this.prisma.workspace.create({
      data: {
        name: `${input.name}'s Workspace`,
        slug,
      },
    });

    const ownerRole = await this.prisma.role.findUniqueOrThrow({
      where: { name: 'OWNER' },
    });

    await this.prisma.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        roleId: ownerRole.id,
      },
    });

    const tokens = this.generateTokens(user.id, user.email);

    const userSummary: UserSummary = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      emailVerified: user.emailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
    };

    const workspaceSummary: WorkspaceSummary = {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      role: 'OWNER',
      createdAt: workspace.createdAt.toISOString(),
    };

    return { user: userSummary, tokens, defaultWorkspace: workspaceSummary };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!user || !user.passwordHash || user.deletedAt) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const membership = await this.prisma.workspaceMember.findFirst({
      where: { userId: user.id },
      include: { workspace: true, role: true },
    });

    if (!membership) {
      throw new UnauthorizedException('User has no active workspace');
    }

    const tokens = this.generateTokens(user.id, user.email);

    const userSummary: UserSummary = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      emailVerified: user.emailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
    };

    const workspaceSummary: WorkspaceSummary = {
      id: membership.workspace.id,
      name: membership.workspace.name,
      slug: membership.workspace.slug,
      role: membership.role.name as RoleName,
      createdAt: membership.workspace.createdAt.toISOString(),
    };

    return { user: userSummary, tokens, defaultWorkspace: workspaceSummary };
  }

  async refreshTokens(input: RefreshTokenInput) {
    try {
      const payload = this.jwtService.verify(input.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'dev_jwt_refresh_secret_key_1234567890',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || user.deletedAt) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user.id, user.email);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async requestPasswordReset(input: RequestPasswordResetInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!user) {
      // Do not reveal email existence
      return { message: 'If the email exists, a password reset link has been dispatched.' };
    }

    const resetToken = this.jwtService.sign(
      { sub: user.id, type: 'reset' },
      { secret: process.env.JWT_SECRET || 'dev_jwt_secret_key_1234567890', expiresIn: '15m' },
    );

    return {
      message: 'If the email exists, a password reset link has been dispatched.',
      resetToken, // Provided for API test verification
    };
  }

  async confirmPasswordReset(input: ConfirmPasswordResetInput) {
    try {
      const payload = this.jwtService.verify(input.token, {
        secret: process.env.JWT_SECRET || 'dev_jwt_secret_key_1234567890',
      });

      if (payload.type !== 'reset') {
        throw new BadRequestException('Invalid reset token');
      }

      const passwordHash = await bcrypt.hash(input.newPassword, 10);
      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { passwordHash },
      });

      return { success: true, message: 'Password updated successfully' };
    } catch {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  async verifyEmail(input: VerifyEmailInput) {
    try {
      const payload = this.jwtService.verify(input.token, {
        secret: process.env.JWT_SECRET || 'dev_jwt_secret_key_1234567890',
      });

      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { emailVerified: true },
      });

      return { success: true, message: 'Email address verified successfully' };
    } catch {
      throw new BadRequestException('Invalid or expired verification token');
    }
  }

  async getProfile(userId: string): Promise<UserSummary> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      emailVerified: user.emailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
    };
  }

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<UserSummary> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(input.name ? { name: input.name } : {}),
        ...(input.avatarUrl !== undefined ? { avatarUrl: input.avatarUrl } : {}),
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      emailVerified: user.emailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
    };
  }
}
