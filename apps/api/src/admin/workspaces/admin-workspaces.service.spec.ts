import { Test, TestingModule } from '@nestjs/testing';
import { AdminWorkspacesService } from './admin-workspaces.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AdminWorkspacesService', () => {
  let service: AdminWorkspacesService;

  const mockPrismaService = {
    workspace: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminWorkspacesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AdminWorkspacesService>(AdminWorkspacesService);
    jest.clearAllMocks();
  });

  it('should list tenant workspaces with member counts and storage quotas', async () => {
    mockPrismaService.workspace.findMany.mockResolvedValue([]);

    const res = await service.listWorkspaces({ page: 1, limit: 10 });

    expect(res.items.length).toBeGreaterThan(0);
    expect(res.items[0].plan).toBeDefined();
  });

  it('should get detailed workspace inspection data', async () => {
    const detail = await service.getWorkspaceDetail('ws-101');

    expect(detail.id).toBe('ws-101');
    expect(detail.socialAccounts.length).toBeGreaterThan(0);
  });

  it('should return agency client portfolio listings', async () => {
    const agencies = await service.listAgencies();

    expect(agencies.length).toBeGreaterThan(0);
    expect(agencies[0].monthlyRevenueUSD).toBeGreaterThan(0);
  });
});
