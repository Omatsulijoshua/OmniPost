import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateWorkspaceInput,
  AddWorkspaceMemberInput,
  UpdateWorkspaceMemberRoleInput,
} from '@omnipost/validation';
import { RoleName, WorkspaceMemberDetail, WorkspaceSummary } from '@omnipost/types';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}

  async createWorkspace(userId: string, input: CreateWorkspaceInput): Promise<WorkspaceSummary> {
    const existing = await this.prisma.workspace.findUnique({
      where: { slug: input.slug.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('Workspace slug is already taken');
    }

    const ownerRole = await this.prisma.role.findUniqueOrThrow({
      where: { name: 'OWNER' },
    });

    const workspace = await this.prisma.workspace.create({
      data: {
        name: input.name,
        slug: input.slug.toLowerCase(),
        members: {
          create: {
            userId,
            roleId: ownerRole.id,
          },
        },
      },
    });

    return {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      role: 'OWNER',
      createdAt: workspace.createdAt.toISOString(),
    };
  }

  async getUserWorkspaces(userId: string): Promise<WorkspaceSummary[]> {
    const members = await this.prisma.workspaceMember.findMany({
      where: { userId },
      include: {
        workspace: true,
        role: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return members.map((m: any) => ({
      id: m.workspace.id,
      name: m.workspace.name,
      slug: m.workspace.slug,
      role: m.role.name as RoleName,
      createdAt: m.workspace.createdAt.toISOString(),
    }));
  }

  async getWorkspaceById(workspaceId: string, userId: string) {
    const member = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
      include: {
        workspace: {
          include: {
            members: {
              include: {
                user: true,
                role: true,
              },
            },
          },
        },
        role: true,
      },
    });

    if (!member) {
      throw new NotFoundException('Workspace not found or access denied');
    }

    const { workspace } = member;

    return {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      role: member.role.name as RoleName,
      createdAt: workspace.createdAt.toISOString(),
      members: workspace.members.map((m: any) => ({
        id: m.id,
        workspaceId: m.workspaceId,
        userId: m.userId,
        role: m.role.name as RoleName,
        user: {
          id: m.user.id,
          email: m.user.email,
          name: m.user.name,
          avatarUrl: m.user.avatarUrl,
        },
        createdAt: m.createdAt.toISOString(),
      })),
    };
  }

  async addWorkspaceMember(
    workspaceId: string,
    actorId: string,
    input: AddWorkspaceMemberInput,
  ): Promise<WorkspaceMemberDetail> {
    const targetUser = await this.prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!targetUser) {
      throw new NotFoundException('User with specified email does not exist');
    }

    const existingMember = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: targetUser.id } },
    });

    if (existingMember) {
      throw new ConflictException('User is already a member of this workspace');
    }

    const role = await this.prisma.role.findUnique({
      where: { name: input.role as RoleName },
    });

    if (!role) {
      throw new BadRequestException('Invalid role specified');
    }

    const newMember = await this.prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: targetUser.id,
        roleId: role.id,
      },
      include: {
        user: true,
        role: true,
      },
    });

    return {
      id: newMember.id,
      workspaceId: newMember.workspaceId,
      userId: newMember.userId,
      role: newMember.role.name as RoleName,
      user: {
        id: newMember.user.id,
        email: newMember.user.email,
        name: newMember.user.name,
        avatarUrl: newMember.user.avatarUrl,
      },
      createdAt: newMember.createdAt.toISOString(),
    };
  }

  async updateMemberRole(
    workspaceId: string,
    actorId: string,
    memberId: string,
    input: UpdateWorkspaceMemberRoleInput,
  ): Promise<WorkspaceMemberDetail> {
    const member = await this.prisma.workspaceMember.findUnique({
      where: { id: memberId },
      include: { role: true },
    });

    if (!member || member.workspaceId !== workspaceId) {
      throw new NotFoundException('Workspace member not found');
    }

    const newRole = await this.prisma.role.findUnique({
      where: { name: input.role as RoleName },
    });

    if (!newRole) {
      throw new BadRequestException('Invalid role specified');
    }

    const updated = await this.prisma.workspaceMember.update({
      where: { id: memberId },
      data: { roleId: newRole.id },
      include: {
        user: true,
        role: true,
      },
    });

    return {
      id: updated.id,
      workspaceId: updated.workspaceId,
      userId: updated.userId,
      role: updated.role.name as RoleName,
      user: {
        id: updated.user.id,
        email: updated.user.email,
        name: updated.user.name,
        avatarUrl: updated.user.avatarUrl,
      },
      createdAt: updated.createdAt.toISOString(),
    };
  }

  async removeMember(workspaceId: string, actorId: string, memberId: string) {
    const member = await this.prisma.workspaceMember.findUnique({
      where: { id: memberId },
      include: { role: true },
    });

    if (!member || member.workspaceId !== workspaceId) {
      throw new NotFoundException('Workspace member not found');
    }

    if (member.role.name === 'OWNER') {
      throw new ForbiddenException('Cannot remove the workspace OWNER');
    }

    await this.prisma.workspaceMember.delete({
      where: { id: memberId },
    });

    return { success: true, message: 'Member removed from workspace' };
  }
}
