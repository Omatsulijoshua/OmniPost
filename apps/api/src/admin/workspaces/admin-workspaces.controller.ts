import { Controller, Get, Post, Param, Query, Body, UseGuards } from '@nestjs/common';
import { AdminWorkspacesService } from './admin-workspaces.service';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { ApiResponse } from '@omnipost/types';

@Controller('admin')
@UseGuards(AdminJwtGuard)
export class AdminWorkspacesController {
  constructor(private readonly adminWorkspacesService: AdminWorkspacesService) {}

  @Get('workspaces')
  async listWorkspaces(
    @Query('search') search?: string,
    @Query('plan') plan?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<ApiResponse> {
    const data = await this.adminWorkspacesService.listWorkspaces({
      search,
      plan,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('workspaces/:id')
  async getWorkspaceDetail(@Param('id') id: string): Promise<ApiResponse> {
    const data = await this.adminWorkspacesService.getWorkspaceDetail(id);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('workspaces/:id/suspend')
  async suspendWorkspace(@Param('id') id: string, @Body('reason') reason: string): Promise<ApiResponse> {
    const data = await this.adminWorkspacesService.suspendWorkspace(id, reason || 'Administrative workspace suspension');
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('workspaces/:id/reactivate')
  async reactivateWorkspace(@Param('id') id: string): Promise<ApiResponse> {
    const data = await this.adminWorkspacesService.reactivateWorkspace(id);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('agencies')
  async listAgencies(): Promise<ApiResponse> {
    const data = await this.adminWorkspacesService.listAgencies();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
