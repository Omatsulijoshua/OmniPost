import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  const mockPrismaService = {
    post: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    jest.clearAllMocks();
  });

  it('should return unified analytics overview metrics', async () => {
    mockPrismaService.post.findMany.mockResolvedValue([]);

    const overview = await service.getOverview('ws-1');

    expect(overview.totalViews).toBeGreaterThan(0);
    expect(overview.averageEngagementRate).toBeGreaterThan(0);
  });

  it('should return cross-platform performance breakdown', async () => {
    const breakdowns = await service.getPlatformBreakdown('ws-1');

    expect(breakdowns.length).toBe(6);
    expect(breakdowns.some((b) => b.platformType === 'INSTAGRAM')).toBe(true);
    expect(breakdowns.some((b) => b.platformType === 'TIKTOK')).toBe(true);
  });

  it('should export analytics report as valid CSV format', async () => {
    mockPrismaService.post.findMany.mockResolvedValue([]);

    const csv = await service.exportReportCsv('ws-1');

    expect(csv).toContain('OmniPost Analytics Performance Report');
    expect(csv).toContain('OVERVIEW SUMMARY');
    expect(csv).toContain('PLATFORM BREAKDOWN');
  });
});
