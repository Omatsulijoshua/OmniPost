import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { AIService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiResponse, PlatformType } from '@omnipost/types';
import {
  adaptCaptionSchema,
  generateHashtagsSchema,
  scoreContentSchema,
  repurposeContentSchema,
  generateImagePromptSchema,
} from '@omnipost/validation';

@Controller('ai')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('adapt-caption')
  @Roles('EDITOR')
  async adaptCaption(
    @Headers('x-workspace-id') workspaceId: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const input = adaptCaptionSchema.parse(body);
    const result = await this.aiService.adaptCaption(workspaceId, input);
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('generate-hashtags')
  @Roles('EDITOR')
  async generateHashtags(
    @Headers('x-workspace-id') workspaceId: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const input = generateHashtagsSchema.parse(body);
    const hashtags = await this.aiService.generateHashtags(workspaceId, input);
    return {
      success: true,
      data: hashtags,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('score-content')
  @Roles('EDITOR')
  async scoreContent(
    @Headers('x-workspace-id') workspaceId: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const input = scoreContentSchema.parse(body);
    const result = await this.aiService.scoreContent(workspaceId, input);
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('recommend-best-time')
  async recommendBestTime(
    @Query('platformType') platformType: PlatformType,
    @Query('timezone') timezone?: string,
  ): Promise<ApiResponse> {
    const result = await this.aiService.recommendBestPostingTime(
      platformType || 'INSTAGRAM',
      timezone || 'UTC',
    );
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('repurpose')
  @Roles('EDITOR')
  async repurposeContent(
    @Headers('x-workspace-id') workspaceId: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const input = repurposeContentSchema.parse(body);
    const result = await this.aiService.repurposeContent(workspaceId, input);
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('generate-image-prompt')
  @Roles('EDITOR')
  async generateImagePrompt(
    @Headers('x-workspace-id') workspaceId: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const input = generateImagePromptSchema.parse(body);
    const prompt = await this.aiService.generateImagePrompt(workspaceId, input);
    return {
      success: true,
      data: { prompt },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('history')
  async getHistory(@Headers('x-workspace-id') workspaceId: string): Promise<ApiResponse> {
    const history = await this.aiService.getHistory(workspaceId);
    return {
      success: true,
      data: history,
      timestamp: new Date().toISOString(),
    };
  }
}
