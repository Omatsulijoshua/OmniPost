import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ApprovalService } from './approval.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiResponse } from '@omnipost/types';
import { actionApprovalSchema, addCommentSchema } from '@omnipost/validation';
import { Response } from 'express';

@Controller('approvals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApprovalController {
  constructor(private readonly approvalService: ApprovalService) {}

  @Post('submit/:postId')
  @Roles('EDITOR')
  async submitForApproval(
    @Headers('x-workspace-id') workspaceId: string,
    @CurrentUser('id') userId: string,
    @Param('postId') postId: string,
  ): Promise<ApiResponse> {
    const result = await this.approvalService.submitForApproval(
      workspaceId,
      userId,
      postId,
    );
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('act/:approvalRequestId')
  @Roles('ADMIN')
  async actionApproval(
    @Headers('x-workspace-id') workspaceId: string,
    @CurrentUser('id') userId: string,
    @Param('approvalRequestId') approvalRequestId: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const input = actionApprovalSchema.parse(body);
    const result = await this.approvalService.actionApproval(
      workspaceId,
      userId,
      approvalRequestId,
      input,
    );
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('pending')
  async getPending(@Headers('x-workspace-id') workspaceId: string): Promise<ApiResponse> {
    const data = await this.approvalService.getPending(workspaceId);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('comments')
  @Roles('EDITOR')
  async addComment(
    @Headers('x-workspace-id') workspaceId: string,
    @CurrentUser('id') userId: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const input = addCommentSchema.parse(body);
    const result = await this.approvalService.addComment(workspaceId, userId, input);
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('comments/:postId')
  async getComments(
    @Headers('x-workspace-id') workspaceId: string,
    @Param('postId') postId: string,
  ): Promise<ApiResponse> {
    const data = await this.approvalService.getComments(workspaceId, postId);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('audit-logs')
  async getAuditLogs(@Headers('x-workspace-id') workspaceId: string): Promise<ApiResponse> {
    const data = await this.approvalService.getAuditLogs(workspaceId);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('audit-logs/export')
  async exportAuditLogs(
    @Headers('x-workspace-id') workspaceId: string,
    @Res() res: Response,
  ) {
    const csv = await this.approvalService.exportAuditLogsCsv(workspaceId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=omnipost_audit_logs_${Date.now()}.csv`,
    );
    return res.send(csv);
  }
}
