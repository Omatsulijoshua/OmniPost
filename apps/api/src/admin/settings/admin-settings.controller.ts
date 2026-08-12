import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { AdminSettingsService } from './admin-settings.service';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { ApiResponse } from '@omnipost/types';

@Controller('admin/settings')
@UseGuards(AdminJwtGuard)
export class AdminSettingsController {
  constructor(private readonly adminSettingsService: AdminSettingsService) {}

  @Get('flags')
  async listFeatureFlags(): Promise<ApiResponse> {
    const data = await this.adminSettingsService.listFeatureFlags();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('flags/:key')
  async updateFeatureFlag(@Param('key') key: string, @Body() body: any): Promise<ApiResponse> {
    const data = await this.adminSettingsService.updateFeatureFlag(key, body);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('platform')
  async getPlatformSettings(): Promise<ApiResponse> {
    const data = await this.adminSettingsService.getPlatformSettings();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('platform')
  async updatePlatformSettings(@Body() body: any): Promise<ApiResponse> {
    const data = await this.adminSettingsService.updatePlatformSettings(body);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('roles')
  async listRolePermissions(): Promise<ApiResponse> {
    const data = await this.adminSettingsService.listRolePermissions();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
