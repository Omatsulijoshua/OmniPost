import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiResponse } from '@omnipost/types';
import { reschedulePostSchema } from '@omnipost/validation';

@Controller('calendar')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Get('posts')
  async getCalendarPosts(
    @Headers('x-workspace-id') workspaceId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<ApiResponse> {
    const posts = await this.schedulerService.getCalendarPosts(
      workspaceId,
      startDate,
      endDate,
    );
    return {
      success: true,
      data: posts,
      timestamp: new Date().toISOString(),
    };
  }

  @Patch('posts/:id/reschedule')
  @Roles('EDITOR')
  async reschedulePost(
    @Headers('x-workspace-id') workspaceId: string,
    @Param('id') id: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const input = reschedulePostSchema.parse(body);
    const post = await this.schedulerService.reschedulePost(
      workspaceId,
      id,
      input.scheduledAt,
    );
    return {
      success: true,
      data: post,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('conflicts')
  async getConflicts(
    @Headers('x-workspace-id') workspaceId: string,
  ): Promise<ApiResponse> {
    const conflicts = await this.schedulerService.detectConflicts(workspaceId);
    return {
      success: true,
      data: conflicts,
      timestamp: new Date().toISOString(),
    };
  }
}
