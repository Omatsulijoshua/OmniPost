import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface AdminSubscriptionItem {
  id: string;
  workspaceId: string;
  workspaceName: string;
  ownerEmail: string;
  planName: string;
  status: 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED' | 'PAUSED';
  amountMonthlyUSD: number;
  provider: 'STRIPE' | 'PAYSTACK' | 'FLUTTERWAVE';
  renewsAt: string;
  createdAt: string;
}

export interface AdminPlanTier {
  id: string;
  name: string;
  priceMonthlyUSD: number;
  maxPostsPerMonth: number;
  maxSocialAccounts: number;
  maxStorageGB: number;
  maxAiCredits: number;
  maxTeamMembers: number;
  analyticsRetentionDays: number;
  apiAccessEnabled: boolean;
}

export interface AdminPaymentTransaction {
  id: string;
  subscriptionId: string;
  customerEmail: string;
  workspaceName: string;
  amountUSD: number;
  provider: 'STRIPE' | 'PAYSTACK' | 'FLUTTERWAVE';
  status: 'SUCCEEDED' | 'FAILED' | 'REFUNDED' | 'PENDING';
  invoiceUrl: string;
  createdAt: string;
}

@Injectable()
export class AdminBillingService {
  constructor(private readonly prisma: PrismaService) {}

  async getRevenueOverview() {
    return {
      mrrUSD: 84500,
      arrUSD: 1014000,
      arpuUSD: 89.5,
      activeSubscriptions: 944,
      churnRatePercent: 2.1,
      newSubscriptionsThisMonth: 112,
      upgradesThisMonth: 34,
      downgradesThisMonth: 8,
    };
  }

  async listSubscriptions(): Promise<AdminSubscriptionItem[]> {
    return [
      {
        id: 'sub-801',
        workspaceId: 'ws-101',
        workspaceName: 'Cyberdyne Systems',
        ownerEmail: 'miles@cyberdyne.com',
        planName: 'Enterprise Agency',
        status: 'ACTIVE',
        amountMonthlyUSD: 299,
        provider: 'STRIPE',
        renewsAt: new Date(Date.now() + 86400000 * 20).toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
      },
      {
        id: 'sub-802',
        workspaceId: 'ws-102',
        workspaceName: 'Apex Growth Lab',
        ownerEmail: 'elena@apexgrowth.io',
        planName: 'Pro Growth',
        status: 'ACTIVE',
        amountMonthlyUSD: 79,
        provider: 'PAYSTACK',
        renewsAt: new Date(Date.now() + 86400000 * 12).toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
      },
    ];
  }

  async listPlans(): Promise<AdminPlanTier[]> {
    return [
      { id: 'plan-free', name: 'Free Tier', priceMonthlyUSD: 0, maxPostsPerMonth: 30, maxSocialAccounts: 3, maxStorageGB: 2, maxAiCredits: 50, maxTeamMembers: 1, analyticsRetentionDays: 7, apiAccessEnabled: false },
      { id: 'plan-creator', name: 'Creator', priceMonthlyUSD: 29, maxPostsPerMonth: 250, maxSocialAccounts: 10, maxStorageGB: 25, maxAiCredits: 500, maxTeamMembers: 3, analyticsRetentionDays: 30, apiAccessEnabled: false },
      { id: 'plan-pro', name: 'Pro Growth', priceMonthlyUSD: 79, maxPostsPerMonth: 1000, maxSocialAccounts: 25, maxStorageGB: 100, maxAiCredits: 2500, maxTeamMembers: 8, analyticsRetentionDays: 90, apiAccessEnabled: true },
      { id: 'plan-agency', name: 'Enterprise Agency', priceMonthlyUSD: 299, maxPostsPerMonth: 10000, maxSocialAccounts: 100, maxStorageGB: 1000, maxAiCredits: 20000, maxTeamMembers: 50, analyticsRetentionDays: 365, apiAccessEnabled: true },
    ];
  }

  async listPayments(): Promise<AdminPaymentTransaction[]> {
    return [
      {
        id: 'tx-9001',
        subscriptionId: 'sub-801',
        customerEmail: 'miles@cyberdyne.com',
        workspaceName: 'Cyberdyne Systems',
        amountUSD: 299,
        provider: 'STRIPE',
        status: 'SUCCEEDED',
        invoiceUrl: 'https://billing.omnipost.com/invoices/inv-9001.pdf',
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      },
      {
        id: 'tx-9002',
        subscriptionId: 'sub-802',
        customerEmail: 'elena@apexgrowth.io',
        workspaceName: 'Apex Growth Lab',
        amountUSD: 79,
        provider: 'PAYSTACK',
        status: 'SUCCEEDED',
        invoiceUrl: 'https://billing.omnipost.com/invoices/inv-9002.pdf',
        createdAt: new Date(Date.now() - 86400000 * 18).toISOString(),
      },
    ];
  }

  async refundPayment(txId: string, reason: string) {
    return {
      success: true,
      transactionId: txId,
      status: 'REFUNDED',
      reason,
      refundedAt: new Date().toISOString(),
    };
  }
}
