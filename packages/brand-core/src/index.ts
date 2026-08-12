import { ContentTemplateDetail } from '@omnipost/types';

export const PREMADE_VIRAL_TEMPLATES: Omit<ContentTemplateDetail, 'id' | 'createdAt'>[] = [
  {
    name: 'The Viral X/Twitter Thread Hook',
    category: 'X / Twitter',
    isGlobal: true,
    templateData: {
      title: 'How I built X in Y days',
      caption: `I spent 30 days analyzing top creators in our niche.\n\nHere are 7 counter-intuitive lessons that will double your growth (Bookmark this 🧵):`,
      recommendedPlatforms: ['X', 'THREADS'],
      suggestedTone: 'Viral',
    },
  },
  {
    name: 'Instagram Carousel Value Deck',
    category: 'Instagram',
    isGlobal: true,
    templateData: {
      title: '5 Steps to Scale',
      caption: `Swipe left to unlock the 5-step framework we used to scale 🚀\n\nWhich slide hit hardest for you? Drop a comment below! 👇`,
      recommendedPlatforms: ['INSTAGRAM', 'LINKEDIN'],
      suggestedTone: 'Educational',
    },
  },
  {
    name: 'LinkedIn Thought Leadership Story',
    category: 'LinkedIn',
    isGlobal: true,
    templateData: {
      title: 'A painful lesson in leadership',
      caption: `3 years ago, I made a $50,000 mistake.\n\nHere is what happened, what it taught our team about culture, and how you can avoid it:`,
      recommendedPlatforms: ['LINKEDIN'],
      suggestedTone: 'Storytelling',
    },
  },
  {
    name: 'TikTok 3-Second Curiosity Hook',
    category: 'TikTok',
    isGlobal: true,
    templateData: {
      title: 'Stop doing this immediately',
      caption: `If you are still doing this in 2026, you are losing money 😱 Watch until the end for the fix! #viral #tech`,
      recommendedPlatforms: ['TIKTOK', 'YOUTUBE'],
      suggestedTone: 'Viral',
    },
  },
  {
    name: 'Product Launch Announcement Deck',
    category: 'Sales & Product',
    isGlobal: true,
    templateData: {
      title: 'Introducing OmniPost 2.0',
      caption: `It is finally here 🎉\n\nMeet the all-new OmniPost 2.0: AI caption adaptation, direct multi-platform publishing, and unified analytics.\n\nTry it free today! Link in bio 🔗`,
      recommendedPlatforms: ['INSTAGRAM', 'FACEBOOK', 'X', 'LINKEDIN'],
      suggestedTone: 'Sales',
    },
  },
];

export class BrandEngine {
  static getPremadeTemplates() {
    return PREMADE_VIRAL_TEMPLATES;
  }

  static applyWatermarkSpec(
    originalMediaUrl: string,
    watermarkUrl?: string | null,
  ): string {
    if (!watermarkUrl) return originalMediaUrl;
    return `${originalMediaUrl}_watermarked_by_${encodeURIComponent(watermarkUrl)}`;
  }
}
