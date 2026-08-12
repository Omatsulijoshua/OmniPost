import { Test, TestingModule } from '@nestjs/testing';
import { MediaService } from './media.service';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from './storage/storage.service';
import { NotFoundException } from '@nestjs/common';

describe('MediaService', () => {
  let service: MediaService;

  const mockPrismaService = {
    mediaAsset: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    folder: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockStorageService = {
    saveOriginalFile: jest.fn().mockResolvedValue('/uploads/ws-1/originals/file.mp4'),
    deleteFile: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: StorageService, useValue: mockStorageService },
      ],
    }).compile();

    service = module.get<MediaService>(MediaService);
    jest.clearAllMocks();
  });

  it('should upload a new video asset and extract dimensions/duration', async () => {
    const mockCreatedAsset = {
      id: 'asset-1',
      workspaceId: 'ws-1',
      filename: 'sample.mp4',
      mimeType: 'video/mp4',
      fileSize: 1024000,
      originalUrl: '/uploads/ws-1/originals/file.mp4',
      duration: 15.0,
      width: 1080,
      height: 1920,
      metadata: { folderId: null },
      variants: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrismaService.mediaAsset.create.mockResolvedValue(mockCreatedAsset);

    const asset = await service.uploadAsset('ws-1', {
      originalname: 'sample.mp4',
      mimetype: 'video/mp4',
      size: 1024000,
      buffer: Buffer.from('test'),
    });

    expect(asset.id).toBe('asset-1');
    expect(asset.mimeType).toBe('video/mp4');
    expect(asset.width).toBe(1080);
    expect(asset.height).toBe(1920);
  });

  it('should list assets with filtering and pagination', async () => {
    mockPrismaService.mediaAsset.findMany.mockResolvedValue([]);
    mockPrismaService.mediaAsset.count.mockResolvedValue(0);

    const result = await service.getAssets('ws-1', {
      type: 'video',
      search: 'promo',
      page: 1,
      limit: 10,
    });

    expect(result.assets).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('should delete single asset and files from storage', async () => {
    mockPrismaService.mediaAsset.findFirst.mockResolvedValue({
      id: 'asset-1',
      workspaceId: 'ws-1',
      originalUrl: '/uploads/ws-1/originals/file.mp4',
      variants: [],
    });

    await service.deleteAsset('ws-1', 'asset-1');

    expect(mockStorageService.deleteFile).toHaveBeenCalledWith(
      '/uploads/ws-1/originals/file.mp4',
    );
    expect(mockPrismaService.mediaAsset.delete).toHaveBeenCalledWith({
      where: { id: 'asset-1' },
    });
  });

  it('should throw NotFoundException if asset to delete is missing', async () => {
    mockPrismaService.mediaAsset.findFirst.mockResolvedValue(null);

    await expect(service.deleteAsset('ws-1', 'nonexistent')).rejects.toThrow(
      NotFoundException,
    );
  });
});
