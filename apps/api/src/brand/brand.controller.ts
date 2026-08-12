import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiResponse } from '@omnipost/types';
import {
  updateBrandKitSchema,
  createContentTemplateSchema,
} from '@omnipost/validation';

@Controller('brand')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get('kit')
  async getBrandKit(@Headers('x-workspace-id') workspaceId: string): Promise<ApiResponse> {
    const data = await this.brandService.getBrandKit(workspaceId);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Patch('kit')
  @Roles('ADMIN')
  async updateBrandKit(
    @Headers('x-workspace-id') workspaceId: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const input = updateBrandKitSchema.parse(body);
    const data = await this.brandService.updateBrandKit(workspaceId, input);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('templates')
  async getTemplates(@Headers('x-workspace-id') workspaceId: string): Promise<ApiResponse> {
    const data = await this.brandService.getTemplates(workspaceId);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('templates')
  @Roles('EDITOR')
  async createTemplate(
    @Headers('x-workspace-id') workspaceId: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const input = createContentTemplateSchema.parse(body);
    const data = await this.brandService.createTemplate(workspaceId, input);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Delete('templates/:id')
  @Roles('EDITOR')
  async deleteTemplate(
    @Headers('x-workspace-id') workspaceId: string,
    @Param('id') id: string,
  ): Promise<ApiResponse> {
    const success = await this.brandService.deleteTemplate(workspaceId, id);
    return {
      success,
      timestamp: new Date().toISOString(),
    };
  }
}
