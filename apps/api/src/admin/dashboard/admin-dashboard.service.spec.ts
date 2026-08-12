import { Test, TestingModule } from '@nestjs/testing';
import { AdminDashboardService } from './admin-dashboard.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AdminDashboardService', () => {
  let service: AdminDashboardService;

  const mockPrismaService = {
    user: { count: jest.fn() },
    workspace: { count: jest.fn() },
    post: { count: jest.fn() },
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminDashboardService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AdminDashboardService>(AdminDashboardService);
    jest.clearAllMocks();
  });

  it('should return executive stats from database queries', async () => {
    mockPrismaService.user.count.mockResolvedValue(25000);
    mockPrismaService.workspace.count.mockResolvedValue(9000);
    mockPrismaService.post.count.mockImplementation((args?: any) => {
      if (args?.where?.status === 'PUBLISHED') return Promise.resolve(1200000);
      if (args?.where?.status === 'FAILED') return Promise.resolve(15000);
      return Promise.resolve(1215000);
    });

    const stats = await service.getExecutiveStats();

    expect(stats.totalUsers).toBe(25000);
    expect(stats.totalWorkspaces).toBe(9000);
    expect(stats.publishingSuccessRate).toBeGreaterThan(90);
  });

  it('should report live system health status', async () => {
    mockPrismaService.$queryRaw.mockResolvedValue([1]);

    const health = await service.getSystemHealth();

    expect(health.database).toBe('Operational');
    expect(health.publishingQueue).toBe('Operational');
  });
});
