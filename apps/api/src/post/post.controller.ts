import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiResponse, PostStatus } from '@omnipost/types';
import { createPostSchema, updatePostSchema } from '@omnipost/validation';

@Controller('posts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @Roles('EDITOR')
  async createPost(
    @Headers('x-workspace-id') workspaceId: string,
    @CurrentUser('id') userId: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const input = createPostSchema.parse(body);
    const result = await this.postService.createPost(workspaceId, userId, input);
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  async getPosts(
    @Headers('x-workspace-id') workspaceId: string,
    @Query('status') status?: PostStatus,
    @Query('folderId') folderId?: string,
  ): Promise<ApiResponse> {
    const posts = await this.postService.getPosts(workspaceId, status, folderId);
    return {
      success: true,
      data: posts,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  async getPostById(
    @Headers('x-workspace-id') workspaceId: string,
    @Param('id') id: string,
  ): Promise<ApiResponse> {
    const post = await this.postService.getPostById(workspaceId, id);
    return {
      success: true,
      data: post,
      timestamp: new Date().toISOString(),
    };
  }

  @Patch(':id')
  @Roles('EDITOR')
  async updatePost(
    @Headers('x-workspace-id') workspaceId: string,
    @Param('id') id: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const input = updatePostSchema.parse(body);
    const post = await this.postService.updatePost(workspaceId, id, input);
    return {
      success: true,
      data: post,
      timestamp: new Date().toISOString(),
    };
  }

  @Delete(':id')
  @Roles('EDITOR')
  async deletePost(
    @Headers('x-workspace-id') workspaceId: string,
    @Param('id') id: string,
  ): Promise<ApiResponse> {
    await this.postService.deletePost(workspaceId, id);
    return {
      success: true,
      data: { message: 'Post deleted successfully' },
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/publish-now')
  @Roles('PUBLISHER')
  async publishNow(
    @Headers('x-workspace-id') workspaceId: string,
    @Param('id') id: string,
  ): Promise<ApiResponse> {
    const post = await this.postService.publishNow(workspaceId, id);
    return {
      success: true,
      data: post,
      timestamp: new Date().toISOString(),
    };
  }
}
