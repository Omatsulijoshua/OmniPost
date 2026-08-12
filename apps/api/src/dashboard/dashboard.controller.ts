import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiResponse } from '@omnipost/types';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats(@Headers('x-workspace-id') workspaceId: string): Promise<ApiResponse> {
    const stats = await this.dashboardService.getDashboardStats(workspaceId);
    return {
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('activity')
  async getActivity(@Headers('x-workspace-id') workspaceId: string): Promise<ApiResponse> {
    const activity = await this.dashboardService.getRecentActivity(workspaceId);
    return {
      success: true,
      data: activity,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('connected-platforms')
  async getConnectedPlatforms(
    @Headers('x-workspace-id') workspaceId: string,
  ): Promise<ApiResponse> {
    const platforms = await this.dashboardService.getConnectedPlatforms(workspaceId);
    return {
      success: true,
      data: platforms,
      timestamp: new Date().toISOString(),
    };
  }
}
