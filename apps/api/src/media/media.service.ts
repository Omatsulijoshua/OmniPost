import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from './storage/storage.service';
import {
  MediaAssetDetail,
  FolderSummary,
  MediaFilterQuery,
} from '@omnipost/types';
import {
  CreateFolderInput,
  UpdateMediaAssetInput,
  BulkDeleteMediaInput,
  BulkMoveMediaInput,
} from '@omnipost/validation';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async uploadAsset(
    workspaceId: string,
    file: { originalname: string; mimetype: string; size: number; buffer: Buffer },
    folderId?: string,
  ): Promise<MediaAssetDetail> {
    const originalUrl = await this.storageService.saveOriginalFile(
      workspaceId,
      file.originalname,
      file.buffer,
    );

    let width: number | null = null;
    let height: number | null = null;
    let duration: number | null = null;

    if (file.mimetype.startsWith('image/')) {
      width = 1920;
      height = 1080;
    } else if (file.mimetype.startsWith('video/')) {
      width = 1080;
      height = 1920;
      duration = 15.0;
    } else if (file.mimetype.startsWith('audio/')) {
      duration = 60.0;
    }

    const asset = await this.prisma.mediaAsset.create({
      data: {
        workspaceId,
        filename: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size,
        originalUrl,
        width,
        height,
        duration,
        metadata: {
          folderId: folderId || null,
          uploadedAt: new Date().toISOString(),
        },
      },
      include: {
        variants: true,
      },
    });

    return this.mapAssetToDetail(asset);
  }

  async getAssets(
    workspaceId: string,
    query: MediaFilterQuery,
  ): Promise<{ assets: MediaAssetDetail[]; total: number }> {
    const where: any = { workspaceId };

    if (query.type && query.type !== 'all') {
      if (query.type === 'video') where.mimeType = { startsWith: 'video/' };
      else if (query.type === 'image') where.mimeType = { startsWith: 'image/' };
      else if (query.type === 'audio') where.mimeType = { startsWith: 'audio/' };
    }

    if (query.search) {
      where.filename = { contains: query.search, mode: 'insensitive' };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (query.sort === 'oldest') orderBy = { createdAt: 'asc' };
    else if (query.sort === 'name') orderBy = { filename: 'asc' };
    else if (query.sort === 'size') orderBy = { fileSize: 'desc' };

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;

    const [assets, total] = await Promise.all([
      this.prisma.mediaAsset.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: { variants: true },
      }),
      this.prisma.mediaAsset.count({ where }),
    ]);

    return {
      assets: assets.map((a: any) => this.mapAssetToDetail(a)),
      total,
    };
  }

  async getAssetById(workspaceId: string, id: string): Promise<MediaAssetDetail> {
    const asset = await this.prisma.mediaAsset.findFirst({
      where: { id, workspaceId },
      include: { variants: true },
    });

    if (!asset) throw new NotFoundException('Media asset not found');

    return this.mapAssetToDetail(asset);
  }

  async updateAsset(
    workspaceId: string,
    id: string,
    input: UpdateMediaAssetInput,
  ): Promise<MediaAssetDetail> {
    const asset = await this.prisma.mediaAsset.findFirst({
      where: { id, workspaceId },
    });

    if (!asset) throw new NotFoundException('Media asset not found');

    const updatedMetadata = {
      ...(asset.metadata as any),
      ...(input.folderId !== undefined ? { folderId: input.folderId } : {}),
    };

    const updated = await this.prisma.mediaAsset.update({
      where: { id },
      data: {
        ...(input.filename ? { filename: input.filename } : {}),
        metadata: updatedMetadata,
      },
      include: { variants: true },
    });

    return this.mapAssetToDetail(updated);
  }

  async deleteAsset(workspaceId: string, id: string): Promise<void> {
    const asset = await this.prisma.mediaAsset.findFirst({
      where: { id, workspaceId },
      include: { variants: true },
    });

    if (!asset) throw new NotFoundException('Media asset not found');

    await this.storageService.deleteFile(asset.originalUrl);
    for (const variant of asset.variants) {
      await this.storageService.deleteFile(variant.url);
    }

    await this.prisma.mediaAsset.delete({ where: { id } });
  }

  async bulkDelete(workspaceId: string, input: BulkDeleteMediaInput): Promise<void> {
    const assets = await this.prisma.mediaAsset.findMany({
      where: { id: { in: input.assetIds }, workspaceId },
      include: { variants: true },
    });

    for (const asset of assets) {
      await this.storageService.deleteFile(asset.originalUrl);
      for (const v of asset.variants) {
        await this.storageService.deleteFile(v.url);
      }
    }

    await this.prisma.mediaAsset.deleteMany({
      where: { id: { in: assets.map((a: any) => a.id) } },
    });
  }

  async bulkMove(workspaceId: string, input: BulkMoveMediaInput): Promise<void> {
    const assets = await this.prisma.mediaAsset.findMany({
      where: { id: { in: input.assetIds }, workspaceId },
    });

    for (const asset of assets) {
      const metadata = {
        ...(asset.metadata as any),
        folderId: input.folderId,
      };
      await this.prisma.mediaAsset.update({
        where: { id: asset.id },
        data: { metadata },
      });
    }
  }

  async createFolder(workspaceId: string, input: CreateFolderInput): Promise<FolderSummary> {
    const folder = await this.prisma.folder.create({
      data: {
        workspaceId,
        name: input.name,
        parentId: input.parentId || null,
      },
    });

    return {
      id: folder.id,
      workspaceId: folder.workspaceId,
      name: folder.name,
      parentId: folder.parentId,
      createdAt: folder.createdAt.toISOString(),
    };
  }

  async getFolders(workspaceId: string): Promise<FolderSummary[]> {
    const folders = await this.prisma.folder.findMany({
      where: { workspaceId },
      orderBy: { name: 'asc' },
    });

    return folders.map((f: any) => ({
      id: f.id,
      workspaceId: f.workspaceId,
      name: f.name,
      parentId: f.parentId,
      createdAt: f.createdAt.toISOString(),
    }));
  }

  async deleteFolder(workspaceId: string, folderId: string): Promise<void> {
    const folder = await this.prisma.folder.findFirst({
      where: { id: folderId, workspaceId },
    });

    if (!folder) throw new NotFoundException('Folder not found');

    await this.prisma.folder.delete({ where: { id: folderId } });
  }

  private mapAssetToDetail(asset: any): MediaAssetDetail {
    return {
      id: asset.id,
      workspaceId: asset.workspaceId,
      filename: asset.filename,
      mimeType: asset.mimeType,
      fileSize: asset.fileSize,
      originalUrl: asset.originalUrl,
      duration: asset.duration,
      width: asset.width,
      height: asset.height,
      metadata: asset.metadata,
      variants: asset.variants
        ? asset.variants.map((v: any) => ({
            id: v.id,
            originalAssetId: v.mediaAssetId,
            preset: v.preset,
            width: v.width,
            height: v.height,
            aspectRatio: v.aspectRatio,
            url: v.url,
            format: v.format,
          }))
        : [],
      createdAt: asset.createdAt.toISOString(),
      updatedAt: asset.updatedAt.toISOString(),
    };
  }
}
