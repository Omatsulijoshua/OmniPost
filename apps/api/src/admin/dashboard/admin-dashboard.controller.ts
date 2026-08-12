import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { ApiResponse } from '@omnipost/types';

@Controller('admin/dashboard')
@UseGuards(AdminJwtGuard)
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  @Get('stats')
  async getStats(): Promise<ApiResponse> {
    const data = await this.adminDashboardService.getExecutiveStats();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  async getHealth(): Promise<ApiResponse> {
    const data = await this.adminDashboardService.getSystemHealth();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('charts')
  async getCharts(): Promise<ApiResponse> {
    const data = await this.adminDashboardService.getChartMetrics();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
