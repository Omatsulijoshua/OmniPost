import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { SocialAccountService } from './social-account.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiResponse, PlatformType } from '@omnipost/types';
import { connectMockAccountSchema, oauthCallbackSchema } from '@omnipost/validation';

@Controller('social-accounts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SocialAccountController {
  constructor(private readonly socialAccountService: SocialAccountService) {}

  @Get()
  async getAccounts(@Headers('x-workspace-id') workspaceId: string): Promise<ApiResponse> {
    const accounts = await this.socialAccountService.getAccounts(workspaceId);
    return {
      success: true,
      data: accounts,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('oauth-url/:platformType')
  @Roles('ADMIN')
  async getOAuthUrl(
    @Param('platformType') platformType: PlatformType,
  ): Promise<ApiResponse> {
    const oauthUrl = await this.socialAccountService.getOAuthUrl(platformType);
    return {
      success: true,
      data: oauthUrl,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('oauth-callback')
  @Roles('ADMIN')
  async oauthCallback(
    @Headers('x-workspace-id') workspaceId: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const input = oauthCallbackSchema.parse(body);
    const account = await this.socialAccountService.handleOAuthCallback(workspaceId, input);
    return {
      success: true,
      data: account,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('connect-mock')
  @Roles('ADMIN')
  async connectMock(
    @Headers('x-workspace-id') workspaceId: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const input = connectMockAccountSchema.parse(body);
    const account = await this.socialAccountService.connectMockAccount(workspaceId, input);
    return {
      success: true,
      data: account,
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/refresh')
  @Roles('ADMIN')
  async refreshToken(
    @Headers('x-workspace-id') workspaceId: string,
    @Param('id') id: string,
  ): Promise<ApiResponse> {
    const account = await this.socialAccountService.refreshToken(workspaceId, id);
    return {
      success: true,
      data: account,
      timestamp: new Date().toISOString(),
    };
  }

  @Delete(':id')
  @Roles('ADMIN')
  async disconnectAccount(
    @Headers('x-workspace-id') workspaceId: string,
    @Param('id') id: string,
  ): Promise<ApiResponse> {
    await this.socialAccountService.disconnectAccount(workspaceId, id);
    return {
      success: true,
      data: { message: 'Social account disconnected successfully' },
      timestamp: new Date().toISOString(),
    };
  }
}
