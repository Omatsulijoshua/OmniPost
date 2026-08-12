import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { AdminPlatformsService } from './admin-platforms.service';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { ApiResponse } from '@omnipost/types';

@Controller('admin/platforms')
@UseGuards(AdminJwtGuard)
export class AdminPlatformsController {
  constructor(private readonly adminPlatformsService: AdminPlatformsService) {}

  @Get()
  async getPlatformsOverview(): Promise<ApiResponse> {
    const data = await this.adminPlatformsService.getPlatformsOverview();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post()
  async registerCustomPlatform(@Body() body: any): Promise<ApiResponse> {
    const data = await this.adminPlatformsService.registerCustomPlatform(body);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/maintenance')
  async togglePlatformMaintenance(
    @Param('id') id: string,
    @Body('maintenance') maintenance: boolean,
  ): Promise<ApiResponse> {
    const data = await this.adminPlatformsService.togglePlatformMaintenance(id, maintenance);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('matrix')
  async getCapabilityMatrix(): Promise<ApiResponse> {
    const data = await this.adminPlatformsService.getCapabilityMatrix();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
