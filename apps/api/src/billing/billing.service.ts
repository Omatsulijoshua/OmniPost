import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BillingEngine } from '@omnipost/billing-core';
import {
  InvoiceItem,
  SubscriptionPlanDetail,
  SubscriptionTier,
} from '@omnipost/types';
import { CheckoutInput } from '@omnipost/validation';

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  async getSubscription(workspaceId: string): Promise<SubscriptionPlanDetail> {
    const sub = await this.prisma.subscription.findFirst({
      where: { workspaceId },
      include: { plan: true },
    });

    const tier: SubscriptionTier = (sub?.plan?.name?.toUpperCase() as SubscriptionTier) || 'PRO';
    const spec = BillingEngine.getTierSpec(tier);

    const postsCount = await this.prisma.post.count({
      where: { workspaceId, deletedAt: null },
    });

    const accountsCount = await this.prisma.socialAccount.count({
      where: { workspaceId },
    });

    const membersCount = await this.prisma.workspaceMember.count({
      where: { workspaceId },
    });

    const mediaCount = await this.prisma.mediaAsset.count({
      where: { workspaceId },
    });

    return {
      id: sub?.id || 'sub_default_mock',
      workspaceId,
      tier,
      status: (sub?.status as any) || 'ACTIVE',
      monthlyPriceUSD: spec.monthlyPriceUSD,
      quota: {
        postsThisMonth: postsCount || 42,
        maxPostsPerMonth: spec.maxPostsPerMonth,
        aiCreditsUsed: 380,
        maxAiCredits: spec.maxAiCredits,
        connectedAccounts: accountsCount || 4,
        maxConnectedAccounts: spec.maxConnectedAccounts,
        teamSeats: membersCount || 2,
        maxTeamSeats: spec.maxTeamSeats,
        storageUsedMB: mediaCount * 15 || 420,
        maxStorageMB: spec.maxStorageMB,
        mediaRetentionDays: tier === 'FREE' || tier === 'CREATOR' ? 30 : 99999,
        permanentStorageEnabled: tier === 'PRO' || tier === 'AGENCY',
      },
      renewsAt: sub?.currentPeriodEnd
        ? sub.currentPeriodEnd.toISOString()
        : new Date(Date.now() + 24 * 3600 * 1000 * 22).toISOString(),
    };
  }

  async createCheckoutSession(
    workspaceId: string,
    input: CheckoutInput,
  ): Promise<{ checkoutUrl: string }> {
    const spec = BillingEngine.getTierSpec(input.targetTier);
    const mockStripeUrl = `https://checkout.stripe.com/pay/cs_test_mock_${workspaceId}_${input.targetTier.toLowerCase()}?price=${spec.monthlyPriceUSD}`;
    return { checkoutUrl: mockStripeUrl };
  }

  async cancelSubscription(workspaceId: string): Promise<boolean> {
    await this.prisma.subscription.updateMany({
      where: { workspaceId },
      data: { status: 'CANCELLED' },
    });
    return true;
  }

  async getInvoices(workspaceId: string): Promise<InvoiceItem[]> {
    return [
      {
        id: 'inv_10921',
        amountUSD: 79,
        status: 'PAID',
        pdfUrl: 'https://omnipost.com/invoices/inv_10921.pdf',
        createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 8).toISOString(),
      },
      {
        id: 'inv_10845',
        amountUSD: 79,
        status: 'PAID',
        pdfUrl: 'https://omnipost.com/invoices/inv_10845.pdf',
        createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 38).toISOString(),
      },
    ];
  }
}
