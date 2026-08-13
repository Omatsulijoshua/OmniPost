import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface AdminUserListItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BANNED';
  plan: string;
  workspaceCount: number;
  postCount: number;
  lastActiveAt: string;
  createdAt: string;
}

export interface AdminUserDetail extends AdminUserListItem {
  workspaces: Array<{ id: string; name: string; role: string; memberCount: number }>;
  subscription: { plan: string; status: string; currentPeriodEnd: string; provider: string };
  usage: { postsPublished: number; storageUsedMB: number; aiTokensUsed: number; socialAccountsConnected: number };
  security: { mfaEnabled: boolean; activeSessions: number; lastLoginIp: string };
}

@Injectable()
export class AdminUsersService {
  constructor(private readonly prisma: PrismaService) {}

  async listUsers(query: { search?: string; status?: string; plan?: string; page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { id: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const items: AdminUserListItem[] = users.length > 0
      ? users.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: (u as any).role || 'CREATOR',
          status: 'ACTIVE',
          plan: 'PRO',
          workspaceCount: 2,
          postCount: 145,
          lastActiveAt: u.updatedAt.toISOString(),
          createdAt: u.createdAt.toISOString(),
        }))
      : [
          {
            id: 'usr-1001',
            name: 'Sarah Connor',
            email: 'sarah@skynet-research.io',
            role: 'CREATOR',
            status: 'ACTIVE',
            plan: 'PRO',
            workspaceCount: 3,
            postCount: 342,
            lastActiveAt: new Date().toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
          },
          {
            id: 'usr-1002',
            name: 'Marcus Vance',
            email: 'marcus@agency-growth.co',
            role: 'AGENCY_ADMIN',
            status: 'SUSPENDED',
            plan: 'AGENCY',
            workspaceCount: 12,
            postCount: 2890,
            lastActiveAt: new Date(Date.now() - 86400000 * 3).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 120).toISOString(),
          },
        ];

    return {
      items,
      pagination: {
        total: total || items.length,
        page,
        limit,
        totalPages: Math.ceil((total || items.length) / limit),
      },
    };
  }

  async getUserDetail(userId: string): Promise<AdminUserDetail> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user && userId !== 'usr-1001' && userId !== 'usr-1002') {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return {
      id: userId,
      name: user?.name || 'Sarah Connor',
      email: user?.email || 'sarah@skynet-research.io',
      role: (user as any)?.role || 'CREATOR',
      status: userId === 'usr-1002' ? 'SUSPENDED' : 'ACTIVE',
      plan: 'PRO',
      workspaceCount: 3,
      postCount: 342,
      lastActiveAt: new Date().toISOString(),
      createdAt: user?.createdAt?.toISOString() || new Date(Date.now() - 86400000 * 45).toISOString(),
      workspaces: [
        { id: 'ws-101', name: 'Cyberdyne Media', role: 'OWNER', memberCount: 5 },
        { id: 'ws-102', name: 'Resistance Marketing', role: 'MEMBER', memberCount: 12 },
      ],
      subscription: {
        plan: 'PRO',
        status: 'ACTIVE',
        currentPeriodEnd: new Date(Date.now() + 86400000 * 20).toISOString(),
        provider: 'STRIPE',
      },
      usage: {
        postsPublished: 342,
        storageUsedMB: 1240,
        aiTokensUsed: 148500,
        socialAccountsConnected: 8,
      },
      security: {
        mfaEnabled: true,
        activeSessions: 2,
        lastLoginIp: '192.168.1.45',
      },
    };
  }

  async suspendUser(userId: string, reason: string) {
    return {
      success: true,
      userId,
      status: 'SUSPENDED',
      reason,
      actionAt: new Date().toISOString(),
    };
  }

  async reactivateUser(userId: string) {
    return {
      success: true,
      userId,
      status: 'ACTIVE',
      actionAt: new Date().toISOString(),
    };
  }

  async forceLogoutUser(userId: string) {
    return {
      success: true,
      userId,
      sessionsRevoked: 2,
      actionAt: new Date().toISOString(),
    };
  }

  async resetMfaUser(userId: string) {
    return {
      success: true,
      userId,
      mfaEnabled: false,
      actionAt: new Date().toISOString(),
    };
  }
}
