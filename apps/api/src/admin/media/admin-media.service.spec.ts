import { Test, TestingModule } from '@nestjs/testing';
import { AdminMediaService } from './admin-media.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AdminMediaService', () => {
  let service: AdminMediaService;

  const mockPrismaService = {
    mediaAsset: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminMediaService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AdminMediaService>(AdminMediaService);
    jest.clearAllMocks();
  });

  it('should return media storage overview statistics', async () => {
    mockPrismaService.mediaAsset.count.mockResolvedValue(20000);

    const stats = await service.getMediaOverview();

    expect(stats.totalStorageUsedGB).toBeGreaterThan(0);
    expect(stats.totalFiles).toBe(20000);
  });

  it('should list FFmpeg transcoding jobs with log lines', async () => {
    const jobs = await service.listTranscodingJobs();

    expect(jobs.length).toBeGreaterThan(0);
    expect(jobs[0].ffmpegLogs.length).toBeGreaterThan(0);
  });

  it('should get top storage consuming workspaces', async () => {
    const top = await service.getTopStorageWorkspaces();

    expect(top.length).toBeGreaterThan(0);
    expect(top[0].storageUsedGB).toBeGreaterThan(0);
  });
});
