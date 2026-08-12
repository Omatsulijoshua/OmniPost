import { Controller, Get, Query, Headers, UseGuards, Res } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiResponse } from '@omnipost/types';
import { Response } from 'express';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  async getOverview(@Headers('x-workspace-id') workspaceId: string): Promise<ApiResponse> {
    const data = await this.analyticsService.getOverview(workspaceId);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('platforms')
  async getPlatformBreakdown(
    @Headers('x-workspace-id') workspaceId: string,
  ): Promise<ApiResponse> {
    const data = await this.analyticsService.getPlatformBreakdown(workspaceId);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('top-posts')
  async getTopPosts(@Headers('x-workspace-id') workspaceId: string): Promise<ApiResponse> {
    const data = await this.analyticsService.getTopPosts(workspaceId);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('export')
  async exportReport(
    @Headers('x-workspace-id') workspaceId: string,
    @Res() res: Response,
  ) {
    const csv = await this.analyticsService.exportReportCsv(workspaceId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=omnipost_analytics_${Date.now()}.csv`,
    );
    return res.send(csv);
  }
}
