import { SubscriptionTier, UsageQuotaDetail } from '@omnipost/types';

export interface TierLimitsSpec {
  maxPostsPerMonth: number;
  maxAiCredits: number;
  maxConnectedAccounts: number;
  maxTeamSeats: number;
  maxStorageMB: number;
  monthlyPriceUSD: number;
}

export const TIER_LIMITS: Record<SubscriptionTier, TierLimitsSpec> = {
  FREE: {
    maxPostsPerMonth: 10,
    maxAiCredits: 100,
    maxConnectedAccounts: 3,
    maxTeamSeats: 1,
    maxStorageMB: 1024, // 1 GB
    monthlyPriceUSD: 0,
  },
  CREATOR: {
    maxPostsPerMonth: 100,
    maxAiCredits: 1000,
    maxConnectedAccounts: 10,
    maxTeamSeats: 3,
    maxStorageMB: 10240, // 10 GB
    monthlyPriceUSD: 29,
  },
  PRO: {
    maxPostsPerMonth: 500,
    maxAiCredits: 5000,
    maxConnectedAccounts: 25,
    maxTeamSeats: 10,
    maxStorageMB: 51200, // 50 GB
    monthlyPriceUSD: 79,
  },
  AGENCY: {
    maxPostsPerMonth: 999999,
    maxAiCredits: 25000,
    maxConnectedAccounts: 999,
    maxTeamSeats: 999,
    maxStorageMB: 512000, // 500 GB
    monthlyPriceUSD: 199,
  },
};

export class BillingEngine {
  static getTierSpec(tier: SubscriptionTier): TierLimitsSpec {
    return TIER_LIMITS[tier] || TIER_LIMITS.FREE;
  }

  static checkQuotaEnforcement(quota: UsageQuotaDetail): {
    shouldBlockPost: boolean;
    shouldBlockAi: boolean;
    reason?: string;
  } {
    if (quota.postsThisMonth >= quota.maxPostsPerMonth) {
      return {
        shouldBlockPost: true,
        shouldBlockAi: false,
        reason: 'Monthly post limit reached. Upgrade to increase quota.',
      };
    }

    if (quota.aiCreditsUsed >= quota.maxAiCredits) {
      return {
        shouldBlockPost: false,
        shouldBlockAi: true,
        reason: 'AI credits exhausted for this billing cycle.',
      };
    }

    return { shouldBlockPost: false, shouldBlockAi: false };
  }
}
