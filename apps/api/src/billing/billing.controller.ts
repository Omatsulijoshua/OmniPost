import { Controller, Get, Post, Body, Headers, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiResponse } from '@omnipost/types';
import { checkoutSchema } from '@omnipost/validation';

@Controller('billing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('subscription')
  async getSubscription(
    @Headers('x-workspace-id') workspaceId: string,
  ): Promise<ApiResponse> {
    const data = await this.billingService.getSubscription(workspaceId);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('checkout')
  @Roles('ADMIN')
  async createCheckoutSession(
    @Headers('x-workspace-id') workspaceId: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const input = checkoutSchema.parse(body);
    const data = await this.billingService.createCheckoutSession(workspaceId, input);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('cancel')
  @Roles('ADMIN')
  async cancelSubscription(
    @Headers('x-workspace-id') workspaceId: string,
  ): Promise<ApiResponse> {
    const success = await this.billingService.cancelSubscription(workspaceId);
    return {
      success,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('invoices')
  async getInvoices(@Headers('x-workspace-id') workspaceId: string): Promise<ApiResponse> {
    const data = await this.billingService.getInvoices(workspaceId);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
