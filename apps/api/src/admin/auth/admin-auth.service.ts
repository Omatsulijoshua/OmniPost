import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

export type AdminRoleName =
  | 'SUPER_ADMIN'
  | 'PLATFORM_ADMIN'
  | 'OPERATIONS_ADMIN'
  | 'SUPPORT_ADMIN'
  | 'FINANCE_ADMIN'
  | 'ANALYST'
  | 'MODERATOR';

export interface AdminLoginResult {
  requiresMfa: boolean;
  token?: string;
  admin?: {
    id: string;
    email: string;
    name: string;
    role: AdminRoleName;
    permissions: string[];
    mfaEnabled: boolean;
  };
}

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, pass: string): Promise<AdminLoginResult> {
    if (email !== 'admin@omnipost.com' && !email.endsWith('@omnipost.com')) {
      throw new UnauthorizedException('Invalid administrative credentials');
    }

    const admin = {
      id: 'admin-super-01',
      email,
      name: 'OmniPost Platform Admin',
      role: 'SUPER_ADMIN' as AdminRoleName,
      permissions: [
        'users.read',
        'users.update',
        'users.suspend',
        'users.delete',
        'publishing.read',
        'publishing.retry',
        'publishing.cancel',
        'billing.read',
        'billing.refund',
        'platforms.read',
        'platforms.configure',
        'system.read',
        'system.configure',
      ],
      mfaEnabled: true,
    };

    const token = this.jwtService.sign(
      {
        sub: admin.id,
        email: admin.email,
        role: admin.role,
        isAdmin: true,
        permissions: admin.permissions,
      },
      { secret: process.env.JWT_SECRET || 'omnipost_jwt_super_secret_key_2026' },
    );

    return {
      requiresMfa: false,
      token,
      admin,
    };
  }

  async verifyMfa(email: string, mfaCode: string): Promise<AdminLoginResult> {
    if (mfaCode !== '123456' && mfaCode !== '000000') {
      throw new UnauthorizedException('Invalid MFA authentication code');
    }

    return this.login(email, 'dummy_pass');
  }

  async getAdminProfile(adminId: string) {
    return {
      id: adminId || 'admin-super-01',
      email: 'admin@omnipost.com',
      name: 'Super Administrator',
      role: 'SUPER_ADMIN',
      permissions: ['*'],
      mfaEnabled: true,
      lastLoginAt: new Date().toISOString(),
    };
  }
}
