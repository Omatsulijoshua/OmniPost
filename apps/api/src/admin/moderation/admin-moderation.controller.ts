import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { AdminModerationService } from './admin-moderation.service';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { ApiResponse } from '@omnipost/types';

@Controller('admin')
@UseGuards(AdminJwtGuard)
export class AdminModerationController {
  constructor(private readonly adminModerationService: AdminModerationService) {}

  @Get('support/tickets')
  async listTickets(): Promise<ApiResponse> {
    const data = await this.adminModerationService.listTickets();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('support/tickets/:id')
  async getTicketDetail(@Param('id') id: string): Promise<ApiResponse> {
    const data = await this.adminModerationService.getTicketDetail(id);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('support/tickets/:id/reply')
  async replyTicket(@Param('id') id: string, @Body('message') message: string): Promise<ApiResponse> {
    const data = await this.adminModerationService.replyTicket(id, message || 'Thank you for reaching out to OmniPost support.');
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('moderation/flagged')
  async listFlaggedContent(): Promise<ApiResponse> {
    const data = await this.adminModerationService.listFlaggedContent();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('moderation/flagged/:id/action')
  async enforceModerationAction(
    @Param('id') id: string,
    @Body('action') action: 'APPROVE' | 'BLOCK' | 'WARN_USER' | 'SUSPEND_WORKSPACE',
  ): Promise<ApiResponse> {
    const data = await this.adminModerationService.enforceModerationAction(id, action || 'BLOCK');
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
