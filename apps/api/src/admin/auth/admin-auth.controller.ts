import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminJwtGuard } from './guards/admin-jwt.guard';
import { ApiResponse } from '@omnipost/types';
import { loginSchema } from '@omnipost/validation';
import { z } from 'zod';

const adminMfaSchema = z.object({
  email: z.string().email(),
  mfaCode: z.string().length(6),
});

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('login')
  async login(@Body() body: any): Promise<ApiResponse> {
    const input = loginSchema.parse(body);
    const data = await this.adminAuthService.login(input.email, input.password);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('verify-mfa')
  async verifyMfa(@Body() body: any): Promise<ApiResponse> {
    const input = adminMfaSchema.parse(body);
    const data = await this.adminAuthService.verifyMfa(input.email, input.mfaCode);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('me')
  @UseGuards(AdminJwtGuard)
  async getProfile(@Req() req: any): Promise<ApiResponse> {
    const data = await this.adminAuthService.getAdminProfile(req.admin?.sub);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('logout')
  @UseGuards(AdminJwtGuard)
  async logout(): Promise<ApiResponse> {
    return {
      success: true,
      data: { message: 'Logged out successfully' },
      timestamp: new Date().toISOString(),
    };
  }
}
