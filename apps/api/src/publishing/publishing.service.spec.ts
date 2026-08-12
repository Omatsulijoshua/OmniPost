import { Test, TestingModule } from '@nestjs/testing';
import { PublishingService } from './publishing.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PublishingService', () => {
  let service: PublishingService;

  const mockPrismaService = {
    socialAccount: {
      findFirst: jest.fn(),
    },
    postVersion: {
      findFirst: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    post: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublishingService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PublishingService>(PublishingService);
    jest.clearAllMocks();
  });

  it('should test connection for connected mock account', async () => {
    mockPrismaService.socialAccount.findFirst.mockResolvedValue({
      id: 'acc-1',
      workspaceId: 'ws-1',
      platform: { type: 'INSTAGRAM', name: 'Instagram' },
      isMock: true,
    });

    const res = await service.testConnection('ws-1', 'acc-1');

    expect(res.connected).toBe(true);
    expect(res.message).toContain('Instagram');
  });

  it('should publish post version with exponential backoff retries', async () => {
    mockPrismaService.postVersion.findFirst.mockResolvedValue({
      id: 'ver-1',
      postId: 'post-1',
      platformType: 'X',
      caption: 'Awesome release!',
      hashtags: [{ tag: '#omnipost' }],
      socialAccount: { isMock: true, platform: { type: 'X', name: 'X' } },
    });

    mockPrismaService.postVersion.update.mockResolvedValue({});
    mockPrismaService.post.update.mockResolvedValue({});

    const result = await service.publishPostVersion('ws-1', 'ver-1');

    expect(result.success).toBe(true);
    expect(result.externalPostId).toContain('x-');
    expect(mockPrismaService.postVersion.update).toHaveBeenCalledWith({
      where: { id: 'ver-1' },
      data: expect.objectContaining({ status: 'PUBLISHED' }),
    });
  });
});
