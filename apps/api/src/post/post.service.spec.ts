import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PlatformValidatorService } from './platform-validator.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PostService & PlatformValidatorService', () => {
  let service: PostService;
  let validator: PlatformValidatorService;

  const mockPrismaService = {
    socialAccount: {
      findMany: jest.fn(),
    },
    post: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        PlatformValidatorService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    validator = module.get<PlatformValidatorService>(PlatformValidatorService);
    jest.clearAllMocks();
  });

  it('should flag character limit validation error for X if caption exceeds 280 chars', () => {
    const longCaption = 'a'.repeat(290);
    const errors = validator.validatePostVersion('X', longCaption);

    expect(errors.length).toBe(1);
    expect(errors[0].field).toBe('caption');
    expect(errors[0].platformType).toBe('X');
  });

  it('should create post and auto-generate per-platform versions with overrides', async () => {
    mockPrismaService.socialAccount.findMany.mockResolvedValue([
      { id: 'acc-x', platform: { type: 'X' } },
      { id: 'acc-insta', platform: { type: 'INSTAGRAM' } },
    ]);

    const mockPost = {
      id: 'post-1',
      workspaceId: 'ws-1',
      authorId: 'user-1',
      universalCaption: 'Universal Launch Announcement',
      status: 'DRAFT',
      author: { name: 'Author' },
      versions: [
        {
          id: 'v-x',
          socialAccountId: 'acc-x',
          platformType: 'X',
          caption: 'Overridden X tweet',
          hashtags: [{ tag: '#tech' }],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrismaService.post.create.mockResolvedValue(mockPost);

    const result = await service.createPost('ws-1', 'user-1', {
      universalCaption: 'Universal Launch Announcement',
      socialAccountIds: ['acc-x', 'acc-insta'],
      isDraft: true,
      overrides: [
        {
          socialAccountId: 'acc-x',
          caption: 'Overridden X tweet',
          hashtags: ['tech'],
        },
      ],
    });

    expect(result.post.id).toBe('post-1');
    expect(result.post.universalCaption).toBe('Universal Launch Announcement');
  });

  it('should throw BadRequestException if no valid social accounts are provided', async () => {
    mockPrismaService.socialAccount.findMany.mockResolvedValue([]);

    await expect(
      service.createPost('ws-1', 'user-1', {
        universalCaption: 'Test post',
        socialAccountIds: ['invalid-id'],
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
