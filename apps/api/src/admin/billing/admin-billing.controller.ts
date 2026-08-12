import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { AdminBillingService } from './admin-billing.service';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { ApiResponse } from '@omnipost/types';

@Controller('admin/billing')
@UseGuards(AdminJwtGuard)
export class AdminBillingController {
  constructor(private readonly adminBillingService: AdminBillingService) {}

  @Get('revenue')
  async getRevenueOverview(): Promise<ApiResponse> {
    const data = await this.adminBillingService.getRevenueOverview();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('subscriptions')
  async listSubscriptions(): Promise<ApiResponse> {
    const data = await this.adminBillingService.listSubscriptions();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('plans')
  async listPlans(): Promise<ApiResponse> {
    const data = await this.adminBillingService.listPlans();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('payments')
  async listPayments(): Promise<ApiResponse> {
    const data = await this.adminBillingService.listPayments();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('payments/:id/refund')
  async refundPayment(@Param('id') id: string, @Body('reason') reason: string): Promise<ApiResponse> {
    const data = await this.adminBillingService.refundPayment(id, reason || 'Customer requested refund');
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
