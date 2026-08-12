import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AdminAuditLogsService } from './admin-audit-logs.service';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { ApiResponse } from '@omnipost/types';

@Controller('admin/audit-logs')
@UseGuards(AdminJwtGuard)
export class AdminAuditLogsController {
  constructor(private readonly adminAuditLogsService: AdminAuditLogsService) {}

  @Get()
  async listAuditLogs(): Promise<ApiResponse> {
    const data = await this.adminAuditLogsService.listAuditLogs();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  async getAuditLogDetail(@Param('id') id: string): Promise<ApiResponse> {
    const data = await this.adminAuditLogsService.getAuditLogDetail(id);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
