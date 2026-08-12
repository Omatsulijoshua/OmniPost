import { Test, TestingModule } from '@nestjs/testing';
import { AdminPublishingService } from './admin-publishing.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AdminPublishingService', () => {
  let service: AdminPublishingService;

  const mockPrismaService = {
    post: { findMany: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminPublishingService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AdminPublishingService>(AdminPublishingService);
    jest.clearAllMocks();
  });

  it('should list global publishing activity with queue metrics', async () => {
    mockPrismaService.post.findMany.mockResolvedValue([]);

    const res = await service.listJobs({ page: 1, limit: 10 });

    expect(res.items.length).toBeGreaterThan(0);
    expect(res.metrics.published).toBeGreaterThan(0);
  });

  it('should group failed jobs by error category', async () => {
    const categories = await service.getFailedJobsGrouped();

    expect(categories.length).toBeGreaterThan(0);
    expect(categories.find((c) => c.category === 'Rate Limit')).toBeDefined();
  });

  it('should trigger bulk retry for a specific error category', async () => {
    const res = await service.bulkRetryCategory('Rate Limit');

    expect(res.success).toBe(true);
    expect(res.jobsRequeuedCount).toBeGreaterThan(0);
  });
});
