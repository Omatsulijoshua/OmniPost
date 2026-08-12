import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { AdminAiService } from './admin-ai.service';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { ApiResponse } from '@omnipost/types';

@Controller('admin/ai')
@UseGuards(AdminJwtGuard)
export class AdminAiController {
  constructor(private readonly adminAiService: AdminAiService) {}

  @Get()
  async getAiOverview(): Promise<ApiResponse> {
    const data = await this.adminAiService.getAiOverview();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('providers')
  async listProviders(): Promise<ApiResponse> {
    const data = await this.adminAiService.listProviders();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('providers/:id/keys')
  async updateProviderKeys(
    @Param('id') id: string,
    @Body('keys') keys: string,
    @Body('strategy') strategy?: 'ROUND_ROBIN' | 'FAILOVER_ON_LIMIT',
  ): Promise<ApiResponse> {
    const data = await this.adminAiService.updateProviderKeys(id, keys || '', strategy);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('providers/:id/test-failover')
  async testFailoverRotation(@Param('id') id: string): Promise<ApiResponse> {
    const data = await this.adminAiService.testFailoverRotation(id);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
