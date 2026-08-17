import { AnalyticsEngine } from '../src';
import { AnalyticsOverview } from '@omnipost/types';

describe('AnalyticsEngine', () => {
  it('should calculate engagement rate accurately', () => {
    const rate = AnalyticsEngine.calculateEngagementRate(100, 20, 10, 10, 1000);
    expect(rate).toBe(14); // (140 / 1000) * 100 = 14%
  });

  it('should return 0 when views are zero', () => {
    const rate = AnalyticsEngine.calculateEngagementRate(10, 5, 2, 1, 0);
    expect(rate).toBe(0);
  });

  it('should format CSV reports properly', () => {
    const overview: AnalyticsOverview = {
      totalViews: 5000,
      totalLikes: 400,
      totalComments: 50,
      totalShares: 25,
      totalClicks: 80,
      totalReach: 4200,
      averageEngagementRate: 11.1,
      publishedPostsCount: 42,
    };
    const breakdowns = [
      {
        platformType: 'INSTAGRAM' as any,
        views: 3000,
        likes: 250,
        comments: 30,
        shares: 15,
        clicks: 40,
        engagementRate: 11.16,
      },
    ];

    const csv = AnalyticsEngine.generateCsvReport(overview, breakdowns);
    expect(csv).toContain('OmniPost Analytics Performance Report');
    expect(csv).toContain('INSTAGRAM,3000,250,30,15,40,11.16');
  });
});
