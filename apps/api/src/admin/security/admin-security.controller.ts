import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { AdminSecurityService } from './admin-security.service';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { ApiResponse } from '@omnipost/types';

@Controller('admin/security')
@UseGuards(AdminJwtGuard)
export class AdminSecurityController {
  constructor(private readonly adminSecurityService: AdminSecurityService) {}

  @Get('policies')
  async getPolicies(): Promise<ApiResponse> {
    const data = await this.adminSecurityService.getPolicies();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('policies')
  async updatePolicies(@Body() body: any): Promise<ApiResponse> {
    const data = await this.adminSecurityService.updatePolicies(body);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('sessions')
  async listActiveSessions(): Promise<ApiResponse> {
    const data = await this.adminSecurityService.listActiveSessions();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('sessions/:id/revoke')
  async revokeSession(@Param('id') id: string): Promise<ApiResponse> {
    const data = await this.adminSecurityService.revokeSession(id);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('telemetry')
  async getThreatTelemetry(): Promise<ApiResponse> {
    const data = await this.adminSecurityService.getThreatTelemetry();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
