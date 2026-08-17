import { BillingEngine, TIER_LIMITS } from '../src';
import { UsageQuotaDetail } from '@omnipost/types';

describe('BillingEngine', () => {
  it('should return tier specifications', () => {
    const creatorSpec = BillingEngine.getTierSpec('CREATOR');
    expect(creatorSpec.monthlyPriceUSD).toBe(29);
    expect(creatorSpec.maxPostsPerMonth).toBe(100);

    const proSpec = BillingEngine.getTierSpec('PRO');
    expect(proSpec.monthlyPriceUSD).toBe(79);
    expect(proSpec.maxConnectedAccounts).toBe(25);
  });

  it('should block publishing when post quota is reached', () => {
    const quota: UsageQuotaDetail = {
      postsThisMonth: 100,
      maxPostsPerMonth: 100,
      aiCreditsUsed: 50,
      maxAiCredits: 1000,
      connectedAccounts: 2,
      maxConnectedAccounts: 5,
      maxTeamSeats: 3,
      teamSeats: 1,
      storageUsedMB: 100,
      maxStorageMB: 1024,
      mediaRetentionDays: 30,
      permanentStorageEnabled: false,
    };

    const result = BillingEngine.checkQuotaEnforcement(quota);
    expect(result.shouldBlockPost).toBe(true);
    expect(result.reason).toContain('Monthly post limit reached');
  });

  it('should allow publishing when within quota limits', () => {
    const quota: UsageQuotaDetail = {
      postsThisMonth: 20,
      maxPostsPerMonth: 100,
      aiCreditsUsed: 50,
      maxAiCredits: 1000,
      connectedAccounts: 2,
      maxConnectedAccounts: 5,
      maxTeamSeats: 3,
      teamSeats: 1,
      storageUsedMB: 100,
      maxStorageMB: 1024,
      mediaRetentionDays: 30,
      permanentStorageEnabled: false,
    };

    const result = BillingEngine.checkQuotaEnforcement(quota);
    expect(result.shouldBlockPost).toBe(false);
    expect(result.shouldBlockAi).toBe(false);
  });
});
