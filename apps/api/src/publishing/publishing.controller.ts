import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { PublishingService } from './publishing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiResponse } from '@omnipost/types';
import {
  testPublishingConnectionSchema,
  retryPublishingSchema,
} from '@omnipost/validation';

@Controller('publishing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PublishingController {
  constructor(private readonly publishingService: PublishingService) {}

  @Post('test-connection')
  @Roles('ADMIN')
  async testConnection(
    @Headers('x-workspace-id') workspaceId: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const input = testPublishingConnectionSchema.parse(body);
    const result = await this.publishingService.testConnection(
      workspaceId,
      input.socialAccountId,
    );
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('retry')
  @Roles('EDITOR')
  async retryPublishing(
    @Headers('x-workspace-id') workspaceId: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const input = retryPublishingSchema.parse(body);
    const result = await this.publishingService.publishPostVersion(
      workspaceId,
      input.postVersionId,
    );
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('logs')
  async getLogs(@Headers('x-workspace-id') workspaceId: string): Promise<ApiResponse> {
    const logs = await this.publishingService.getLogs(workspaceId);
    return {
      success: true,
      data: logs,
      timestamp: new Date().toISOString(),
    };
  }
}
