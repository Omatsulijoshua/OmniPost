import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { TranscodingService } from './transcoding.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiResponse } from '@omnipost/types';
import { createTranscodingJobSchema } from '@omnipost/validation';

@Controller('transcoding')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TranscodingController {
  constructor(private readonly transcodingService: TranscodingService) {}

  @Get('presets')
  getPresets(): ApiResponse {
    const presets = this.transcodingService.getAvailablePresets();
    return {
      success: true,
      data: presets,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('jobs')
  @Roles('EDITOR')
  async createJob(
    @Headers('x-workspace-id') workspaceId: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const input = createTranscodingJobSchema.parse(body);
    const job = await this.transcodingService.createJob(workspaceId, input);
    return {
      success: true,
      data: job,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('jobs/:id')
  async getJobById(
    @Headers('x-workspace-id') workspaceId: string,
    @Param('id') id: string,
  ): Promise<ApiResponse> {
    const job = await this.transcodingService.getJobById(workspaceId, id);
    return {
      success: true,
      data: job,
      timestamp: new Date().toISOString(),
    };
  }
}
