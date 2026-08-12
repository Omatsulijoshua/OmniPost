import { Controller, Get, Post, Param, Query, Body, UseGuards } from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { ApiResponse } from '@omnipost/types';

@Controller('admin/users')
@UseGuards(AdminJwtGuard)
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  async listUsers(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('plan') plan?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<ApiResponse> {
    const data = await this.adminUsersService.listUsers({ search, status, plan, page: Number(page) || 1, limit: Number(limit) || 10 });
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  async getUserDetail(@Param('id') id: string): Promise<ApiResponse> {
    const data = await this.adminUsersService.getUserDetail(id);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/suspend')
  async suspendUser(@Param('id') id: string, @Body('reason') reason: string): Promise<ApiResponse> {
    const data = await this.adminUsersService.suspendUser(id, reason || 'Administrative suspension');
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/reactivate')
  async reactivateUser(@Param('id') id: string): Promise<ApiResponse> {
    const data = await this.adminUsersService.reactivateUser(id);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/force-logout')
  async forceLogoutUser(@Param('id') id: string): Promise<ApiResponse> {
    const data = await this.adminUsersService.forceLogoutUser(id);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/reset-mfa')
  async resetMfaUser(@Param('id') id: string): Promise<ApiResponse> {
    const data = await this.adminUsersService.resetMfaUser(id);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
