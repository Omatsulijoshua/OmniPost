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

  it('should return detailed execution timeline for a publishing job', async () => {
    const detail = await service.getJobDetail('job-901');

    expect(detail.id).toBe('job-901');
    expect(detail.timeline.length).toBe(6);
  });

  it('should trigger administrative retry on a failed job', async () => {
    const res = await service.retryJob('job-902');

    expect(res.status).toBe('RETRYING');
  });
});
