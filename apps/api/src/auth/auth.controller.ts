import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  requestPasswordResetSchema,
  confirmPasswordResetSchema,
  verifyEmailSchema,
  updateProfileSchema,
} from '@omnipost/validation';
import { ApiResponse } from '@omnipost/types';

@Controller()
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('auth/register')
  async register(@Body() body: any): Promise<ApiResponse> {
    const payload = {
      ...body,
      name: body.name || body.fullName || body.name,
    };
    const parsed = registerSchema.parse(payload);
    const result = await this.authService.register(parsed);
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any): Promise<ApiResponse> {
    const parsed = loginSchema.parse(body);
    const result = await this.authService.login(parsed);
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Post('auth/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Body() body: any): Promise<ApiResponse> {
    const parsed = refreshTokenSchema.parse(body);
    const result = await this.authService.refreshTokens(parsed);
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Post('auth/password-reset/request')
  @HttpCode(HttpStatus.OK)
  async requestPasswordReset(@Body() body: any): Promise<ApiResponse> {
    const parsed = requestPasswordResetSchema.parse(body);
    const result = await this.authService.requestPasswordReset(parsed);
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Post('auth/password-reset/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmPasswordReset(@Body() body: any): Promise<ApiResponse> {
    const parsed = confirmPasswordResetSchema.parse(body);
    const result = await this.authService.confirmPasswordReset(parsed);
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Post('auth/verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() body: any): Promise<ApiResponse> {
    const parsed = verifyEmailSchema.parse(body);
    const result = await this.authService.verifyEmail(parsed);
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('users/me')
  async getProfile(@CurrentUser('id') userId: string): Promise<ApiResponse> {
    const profile = await this.authService.getProfile(userId);
    return {
      success: true,
      data: profile,
      timestamp: new Date().toISOString(),
    };
  }

  @Patch('users/me')
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const parsed = updateProfileSchema.parse(body);
    const updated = await this.authService.updateProfile(userId, parsed);
    return {
      success: true,
      data: updated,
      timestamp: new Date().toISOString(),
    };
  }
}
