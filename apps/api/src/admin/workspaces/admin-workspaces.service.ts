import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface AdminWorkspaceListItem {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  ownerEmail: string;
  memberCount: number;
  plan: string;
  connectedAccountCount: number;
  postCount: number;
  storageUsedMB: number;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export interface AdminAgencyItem {
  id: string;
  agencyName: string;
  ownerEmail: string;
  clientWorkspaceCount: number;
  totalTeamMembers: number;
  totalConnectedAccounts: number;
  totalPostsPublished: number;
  monthlyRevenueUSD: number;
  storageUsedMB: number;
}

@Injectable()
export class AdminWorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

  async listWorkspaces(query: { search?: string; plan?: string; page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 10;

    const workspaces = await this.prisma.workspace.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
    });

    const items: AdminWorkspaceListItem[] = workspaces.length > 0
      ? workspaces.map((w) => ({
          id: w.id,
          name: w.name,
          slug: w.slug,
          ownerName: 'Workspace Owner',
          ownerEmail: 'owner@omnipost.com',
          memberCount: 4,
          plan: 'PRO',
          connectedAccountCount: 6,
          postCount: 182,
          storageUsedMB: 480,
          status: 'ACTIVE',
          createdAt: w.createdAt.toISOString(),
        }))
      : [
          {
            id: 'ws-101',
            name: 'Cyberdyne Systems',
            slug: 'cyberdyne-systems',
            ownerName: 'Miles Dyson',
            ownerEmail: 'miles@cyberdyne.com',
            memberCount: 8,
            plan: 'AGENCY',
            connectedAccountCount: 14,
            postCount: 1420,
            storageUsedMB: 3450,
            status: 'ACTIVE',
            createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
          },
          {
            id: 'ws-102',
            name: 'Apex Growth Lab',
            slug: 'apex-growth',
            ownerName: 'Elena Rostova',
            ownerEmail: 'elena@apexgrowth.io',
            memberCount: 15,
            plan: 'BUSINESS',
            connectedAccountCount: 22,
            postCount: 3890,
            storageUsedMB: 8900,
            status: 'ACTIVE',
            createdAt: new Date(Date.now() - 86400000 * 180).toISOString(),
          },
        ];

    return {
      items,
      pagination: {
        total: items.length,
        page,
        limit,
        totalPages: 1,
      },
    };
  }

  async getWorkspaceDetail(workspaceId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace && workspaceId !== 'ws-101' && workspaceId !== 'ws-102') {
      throw new NotFoundException(`Workspace ${workspaceId} not found`);
    }

    return {
      id: workspaceId,
      name: workspace?.name || 'Cyberdyne Systems',
      slug: workspace?.slug || 'cyberdyne-systems',
      status: 'ACTIVE',
      plan: 'AGENCY',
      owner: {
        id: 'usr-miles',
        name: 'Miles Dyson',
        email: 'miles@cyberdyne.com',
      },
      members: [
        { id: 'usr-1', name: 'Miles Dyson', role: 'OWNER', email: 'miles@cyberdyne.com' },
        { id: 'usr-2', name: 'John Connor', role: 'ADMIN', email: 'john@resistance.org' },
      ],
      socialAccounts: [
        { platform: 'INSTAGRAM', accountName: '@cyberdyne_tech', status: 'CONNECTED' },
        { platform: 'LINKEDIN', accountName: 'Cyberdyne Systems Inc', status: 'CONNECTED' },
        { platform: 'X', accountName: '@CyberdyneInc', status: 'CONNECTED' },
      ],
      usage: {
        postsPublished: 1420,
        storageUsedMB: 3450,
        aiTokensUsed: 890000,
      },
    };
  }

  async suspendWorkspace(workspaceId: string, reason: string) {
    return {
      success: true,
      workspaceId,
      status: 'SUSPENDED',
      reason,
      actionAt: new Date().toISOString(),
    };
  }

  async reactivateWorkspace(workspaceId: string) {
    return {
      success: true,
      workspaceId,
      status: 'ACTIVE',
      actionAt: new Date().toISOString(),
    };
  }

  async listAgencies(): Promise<AdminAgencyItem[]> {
    return [
      {
        id: 'ag-201',
        agencyName: 'Vanguard Global Media Agency',
        ownerEmail: 'director@vanguard-media.com',
        clientWorkspaceCount: 18,
        totalTeamMembers: 34,
        totalConnectedAccounts: 112,
        totalPostsPublished: 24890,
        monthlyRevenueUSD: 4490,
        storageUsedMB: 45000,
      },
      {
        id: 'ag-202',
        agencyName: 'Pulse Digital Growth',
        ownerEmail: 'contact@pulsedigital.io',
        clientWorkspaceCount: 9,
        totalTeamMembers: 16,
        totalConnectedAccounts: 54,
        totalPostsPublished: 11200,
        monthlyRevenueUSD: 1990,
        storageUsedMB: 18400,
      },
    ];
  }
}
