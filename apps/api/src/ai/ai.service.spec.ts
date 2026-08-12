import { Test, TestingModule } from '@nestjs/testing';
import { AIService } from './ai.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AIService', () => {
  let service: AIService;

  const mockPrismaService = {
    aIJob: {
      create: jest.fn().mockResolvedValue({ id: 'ai-job-1' }),
      findMany: jest.fn().mockResolvedValue([]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AIService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AIService>(AIService);
    jest.clearAllMocks();
  });

  it('should adapt caption for X with Viral tone', async () => {
    const result = await service.adaptCaption('ws-1', {
      caption: 'Big launch coming soon!',
      platformType: 'X',
      tone: 'Viral',
    });

    expect(result.platformType).toBe('X');
    expect(result.tone).toBe('Viral');
    expect(result.adaptedCaption).toContain('🔥');
    expect(mockPrismaService.aIJob.create).toHaveBeenCalled();
  });

  it('should calculate content score for Instagram caption', async () => {
    const audit = await service.scoreContent('ws-1', {
      caption: 'What is your favorite social media platform? Comment below!',
      platformType: 'INSTAGRAM',
    });

    expect(audit.score).toBeGreaterThanOrEqual(80);
    expect(audit.strengths.length).toBeGreaterThan(0);
    expect(mockPrismaService.aIJob.create).toHaveBeenCalled();
  });

  it('should recommend best posting time', async () => {
    const rec = await service.recommendBestPostingTime('INSTAGRAM', 'America/New_York');

    expect(rec.platformType).toBe('INSTAGRAM');
    expect(rec.bestDay).toBeDefined();
    expect(rec.bestHour).toBeDefined();
  });
});
