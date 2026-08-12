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

  @Post('providers/:id')
  async updateProvider(@Param('id') id: string, @Body() body: any): Promise<ApiResponse> {
    const data = await this.adminAiService.updateProvider(id, body);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
