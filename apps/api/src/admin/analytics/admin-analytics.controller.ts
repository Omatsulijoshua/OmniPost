import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminAnalyticsService } from './admin-analytics.service';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { ApiResponse } from '@omnipost/types';

@Controller('admin/analytics')
@UseGuards(AdminJwtGuard)
export class AdminAnalyticsController {
  constructor(private readonly adminAnalyticsService: AdminAnalyticsService) {}

  @Get('executive')
  async getExecutiveAnalytics(@Query('timeframe') timeframe?: string): Promise<ApiResponse> {
    const data = await this.adminAnalyticsService.getExecutiveAnalytics(timeframe || '30d');
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('product')
  async getProductAnalytics(): Promise<ApiResponse> {
    const data = await this.adminAnalyticsService.getProductAnalytics();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('platforms')
  async getPlatformComparison(): Promise<ApiResponse> {
    const data = await this.adminAnalyticsService.getPlatformComparison();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
