import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { AdminPlatformsService } from './admin-platforms.service';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { ApiResponse } from '@omnipost/types';

@Controller('admin/platforms')
@UseGuards(AdminJwtGuard)
export class AdminPlatformsController {
  constructor(private readonly adminPlatformsService: AdminPlatformsService) {}

  @Get()
  async listPlatforms(): Promise<ApiResponse> {
    const data = await this.adminPlatformsService.listPlatforms();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('matrix')
  async getMatrix(): Promise<ApiResponse> {
    const data = await this.adminPlatformsService.getCapabilityMatrix();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  async getPlatformDetail(@Param('id') id: string): Promise<ApiResponse> {
    const data = await this.adminPlatformsService.getPlatformDetail(id);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/maintenance')
  async toggleMaintenance(@Param('id') id: string, @Body('maintenance') maintenance: boolean): Promise<ApiResponse> {
    const data = await this.adminPlatformsService.toggleMaintenance(id, maintenance);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
