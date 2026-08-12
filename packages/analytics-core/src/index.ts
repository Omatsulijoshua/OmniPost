import {
  AnalyticsOverview,
  PlatformMetricsBreakdown,
  PlatformType,
} from '@omnipost/types';

export class AnalyticsEngine {
  static calculateEngagementRate(
    likes: number,
    comments: number,
    shares: number,
    clicks: number,
    views: number,
  ): number {
    if (views <= 0) return 0;
    const totalInteractions = likes + comments + shares + clicks;
    return Math.round(((totalInteractions / views) * 100) * 100) / 100;
  }

  static generateCsvReport(
    overview: AnalyticsOverview,
    breakdowns: PlatformMetricsBreakdown[],
  ): string {
    const lines: string[] = [];
    lines.push('OmniPost Analytics Performance Report');
    lines.push(`Generated Date,${new Date().toISOString()}`);
    lines.push('');
    lines.push('OVERVIEW SUMMARY');
    lines.push(`Total Views,${overview.totalViews}`);
    lines.push(`Total Likes,${overview.totalLikes}`);
    lines.push(`Total Comments,${overview.totalComments}`);
    lines.push(`Total Shares,${overview.totalShares}`);
    lines.push(`Total Clicks,${overview.totalClicks}`);
    lines.push(`Total Reach,${overview.totalReach}`);
    lines.push(`Avg Engagement Rate (%),${overview.averageEngagementRate}`);
    lines.push('');
    lines.push('PLATFORM BREAKDOWN');
    lines.push('Platform,Views,Likes,Comments,Shares,Clicks,Engagement Rate (%)');

    for (const b of breakdowns) {
      lines.push(
        `${b.platformType},${b.views},${b.likes},${b.comments},${b.shares},${b.clicks},${b.engagementRate}`,
      );
    }

    return lines.join('\n');
  }
}
