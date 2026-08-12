import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { AdminSystemService } from './admin-system.service';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { ApiResponse } from '@omnipost/types';

@Controller('admin/system')
@UseGuards(AdminJwtGuard)
export class AdminSystemController {
  constructor(private readonly adminSystemService: AdminSystemService) {}

  @Get('health')
  async getHealthOverview(): Promise<ApiResponse> {
    const data = await this.adminSystemService.getHealthOverview();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('queues')
  async listQueues(): Promise<ApiResponse> {
    const data = await this.adminSystemService.listQueues();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('queues/:name/pause')
  async pauseQueue(@Param('name') name: string): Promise<ApiResponse> {
    const data = await this.adminSystemService.toggleQueuePause(name, true);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('queues/:name/resume')
  async resumeQueue(@Param('name') name: string): Promise<ApiResponse> {
    const data = await this.adminSystemService.toggleQueuePause(name, false);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('workers')
  async listWorkerFleet(): Promise<ApiResponse> {
    const data = await this.adminSystemService.listWorkerFleet();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
