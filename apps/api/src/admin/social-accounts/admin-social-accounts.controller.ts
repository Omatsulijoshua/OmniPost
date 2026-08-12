import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { AdminSocialAccountsService } from './admin-social-accounts.service';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { ApiResponse } from '@omnipost/types';

@Controller('admin/social-accounts')
@UseGuards(AdminJwtGuard)
export class AdminSocialAccountsController {
  constructor(private readonly adminSocialAccountsService: AdminSocialAccountsService) {}

  @Get()
  async listSocialAccounts(
    @Query('platform') platform?: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<ApiResponse> {
    const data = await this.adminSocialAccountsService.listSocialAccounts({
      platform,
      status,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('token-health')
  async getTokenHealthSummary(): Promise<ApiResponse> {
    const data = await this.adminSocialAccountsService.getTokenHealthSummary();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/disconnect')
  async disconnectAccount(@Param('id') id: string): Promise<ApiResponse> {
    const data = await this.adminSocialAccountsService.disconnectAccount(id);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
