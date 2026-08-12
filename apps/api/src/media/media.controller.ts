import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiResponse } from '@omnipost/types';
import {
  createFolderSchema,
  updateMediaAssetSchema,
  bulkDeleteMediaSchema,
  bulkMoveMediaSchema,
} from '@omnipost/validation';

@Controller('media')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @Roles('EDITOR')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Headers('x-workspace-id') workspaceId: string,
    @UploadedFile() file: any,
    @Body('folderId') folderId?: string,
  ): Promise<ApiResponse> {
    if (!file) {
      return {
        success: false,
        error: { code: 'FILE_MISSING', message: 'No file was uploaded' },
        timestamp: new Date().toISOString(),
      };
    }

    const asset = await this.mediaService.uploadAsset(workspaceId, file, folderId);
    return {
      success: true,
      data: asset,
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  async getAssets(
    @Headers('x-workspace-id') workspaceId: string,
    @Query() query: any,
  ): Promise<ApiResponse> {
    const result = await this.mediaService.getAssets(workspaceId, query);
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('folders')
  async getFolders(@Headers('x-workspace-id') workspaceId: string): Promise<ApiResponse> {
    const folders = await this.mediaService.getFolders(workspaceId);
    return {
      success: true,
      data: folders,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('folders')
  @Roles('EDITOR')
  async createFolder(
    @Headers('x-workspace-id') workspaceId: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const input = createFolderSchema.parse(body);
    const folder = await this.mediaService.createFolder(workspaceId, input);
    return {
      success: true,
      data: folder,
      timestamp: new Date().toISOString(),
    };
  }

  @Delete('folders/:id')
  @Roles('EDITOR')
  async deleteFolder(
    @Headers('x-workspace-id') workspaceId: string,
    @Param('id') id: string,
  ): Promise<ApiResponse> {
    await this.mediaService.deleteFolder(workspaceId, id);
    return {
      success: true,
      data: { message: 'Folder deleted successfully' },
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  async getAssetById(
    @Headers('x-workspace-id') workspaceId: string,
    @Param('id') id: string,
  ): Promise<ApiResponse> {
    const asset = await this.mediaService.getAssetById(workspaceId, id);
    return {
      success: true,
      data: asset,
      timestamp: new Date().toISOString(),
    };
  }

  @Patch(':id')
  @Roles('EDITOR')
  async updateAsset(
    @Headers('x-workspace-id') workspaceId: string,
    @Param('id') id: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const input = updateMediaAssetSchema.parse(body);
    const asset = await this.mediaService.updateAsset(workspaceId, id, input);
    return {
      success: true,
      data: asset,
      timestamp: new Date().toISOString(),
    };
  }

  @Delete(':id')
  @Roles('EDITOR')
  async deleteAsset(
    @Headers('x-workspace-id') workspaceId: string,
    @Param('id') id: string,
  ): Promise<ApiResponse> {
    await this.mediaService.deleteAsset(workspaceId, id);
    return {
      success: true,
      data: { message: 'Media asset deleted successfully' },
      timestamp: new Date().toISOString(),
    };
  }

  @Post('bulk-delete')
  @Roles('EDITOR')
  async bulkDelete(
    @Headers('x-workspace-id') workspaceId: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const input = bulkDeleteMediaSchema.parse(body);
    await this.mediaService.bulkDelete(workspaceId, input);
    return {
      success: true,
      data: { message: 'Selected media assets deleted successfully' },
      timestamp: new Date().toISOString(),
    };
  }

  @Post('bulk-move')
  @Roles('EDITOR')
  async bulkMove(
    @Headers('x-workspace-id') workspaceId: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const input = bulkMoveMediaSchema.parse(body);
    await this.mediaService.bulkMove(workspaceId, input);
    return {
      success: true,
      data: { message: 'Selected media assets moved successfully' },
      timestamp: new Date().toISOString(),
    };
  }
}
