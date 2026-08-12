import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { AdminMediaService } from './admin-media.service';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { ApiResponse } from '@omnipost/types';

@Controller('admin/media')
@UseGuards(AdminJwtGuard)
export class AdminMediaController {
  constructor(private readonly adminMediaService: AdminMediaService) {}

  @Get()
  async getMediaOverview(): Promise<ApiResponse> {
    const data = await this.adminMediaService.getMediaOverview();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('assets')
  async listMediaAssets(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<ApiResponse> {
    const data = await this.adminMediaService.listMediaAssets({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('jobs')
  async listTranscodingJobs(): Promise<ApiResponse> {
    const data = await this.adminMediaService.listTranscodingJobs();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('jobs/:id/retry')
  async retryTranscodingJob(@Param('id') id: string): Promise<ApiResponse> {
    const data = await this.adminMediaService.retryTranscodingJob(id);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('storage')
  async getTopStorageWorkspaces(): Promise<ApiResponse> {
    const data = await this.adminMediaService.getTopStorageWorkspaces();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
