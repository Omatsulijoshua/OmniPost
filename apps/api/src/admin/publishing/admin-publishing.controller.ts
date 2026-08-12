import { Controller, Get, Post, Param, Query, Body, UseGuards } from '@nestjs/common';
import { AdminPublishingService } from './admin-publishing.service';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { ApiResponse } from '@omnipost/types';

@Controller('admin/publishing')
@UseGuards(AdminJwtGuard)
export class AdminPublishingController {
  constructor(private readonly adminPublishingService: AdminPublishingService) {}

  @Get('jobs')
  async listJobs(
    @Query('status') status?: string,
    @Query('platform') platform?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<ApiResponse> {
    const data = await this.adminPublishingService.listJobs({
      status,
      platform,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('failed')
  async getFailedJobsGrouped(): Promise<ApiResponse> {
    const data = await this.adminPublishingService.getFailedJobsGrouped();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('failed/bulk-retry')
  async bulkRetryCategory(@Body('category') category: string): Promise<ApiResponse> {
    const data = await this.adminPublishingService.bulkRetryCategory(category || 'Rate Limit');
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('jobs/:id')
  async getJobDetail(@Param('id') id: string): Promise<ApiResponse> {
    const data = await this.adminPublishingService.getJobDetail(id);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('jobs/:id/retry')
  async retryJob(@Param('id') id: string): Promise<ApiResponse> {
    const data = await this.adminPublishingService.retryJob(id);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('jobs/:id/cancel')
  async cancelJob(@Param('id') id: string): Promise<ApiResponse> {
    const data = await this.adminPublishingService.cancelJob(id);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('jobs/:id/requeue')
  async requeueJob(@Param('id') id: string): Promise<ApiResponse> {
    const data = await this.adminPublishingService.requeueJob(id);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
