export interface ToneSpec {
  name: string;
  instruction: string;
  emojiPrefix: string;
}

export const TONE_SPECS: Record<string, ToneSpec> = {
  Professional: {
    name: 'Professional',
    instruction: 'Use authoritative, polished, and industry-tailored language. Focus on business value and clarity.',
    emojiPrefix: '💼',
  },
  Viral: {
    name: 'Viral',
    instruction: 'Use high-hook opening lines, short punchy sentences, strong curiosity triggers, and active engagement questions.',
    emojiPrefix: '🔥',
  },
  Casual: {
    name: 'Casual',
    instruction: 'Use friendly, conversational, and relatable tone as if chatting with a peer.',
    emojiPrefix: '💬',
  },
  Sales: {
    name: 'Sales',
    instruction: 'Focus on benefits, pain points, high value propositions, social proof, and strong calls-to-action.',
    emojiPrefix: '📈',
  },
  Storytelling: {
    name: 'Storytelling',
    instruction: 'Begin with a narrative hook, set the scene, outline the transformation/lesson learned, and share a takeaways.',
    emojiPrefix: '📖',
  },
  Educational: {
    name: 'Educational',
    instruction: 'Break down complex concepts into bullet points, actionable tips, and key takeaways.',
    emojiPrefix: '💡',
  },
  Humor: {
    name: 'Humor',
    instruction: 'Use witty observations, subtle self-deprecation, clever puns, and lighthearted humor.',
    emojiPrefix: '😂',
  },
};

export interface AIProviderConfig {
  apiKey?: string;
  modelName?: string;
}

export abstract class BaseAIProvider {
  abstract adaptCaption(
    caption: string,
    platform: string,
    tone: string,
  ): Promise<{ adaptedCaption: string; hashtags: string[] }>;

  abstract calculateContentScore(
    caption: string,
    platform: string,
  ): Promise<{ score: number; rating: 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'POOR'; strengths: string[]; improvements: string[] }>;

  abstract recommendBestPostingTime(
    platform: string,
    timezone?: string,
  ): Promise<{ bestDay: string; bestHour: string; confidenceScore: number }>;

  abstract repurposeText(
    sourceText: string,
    targetPlatforms: string[],
  ): Promise<Record<string, string>>;

  abstract generateImagePrompt(concept: string, style?: string): Promise<string>;
}

export class MockAIProvider extends BaseAIProvider {
  async adaptCaption(
    caption: string,
    platform: string,
    tone: string,
  ): Promise<{ adaptedCaption: string; hashtags: string[] }> {
    const toneSpec = TONE_SPECS[tone] || TONE_SPECS.Casual;
    const prefix = toneSpec.emojiPrefix;

    let adapted = `${prefix} [${platform} - ${tone}] ${caption}`;
    if (platform === 'X' && adapted.length > 270) {
      adapted = `${adapted.substring(0, 260)}... 🧵`;
    }

    const hashtags = [
      `#${platform.toLowerCase()}`,
      `#${tone.toLowerCase()}`,
      '#omnipost',
      '#growth',
    ];

    return { adaptedCaption: adapted, hashtags };
  }

  async calculateContentScore(
    caption: string,
    platform: string,
  ): Promise<{ score: number; rating: 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'POOR'; strengths: string[]; improvements: string[] }> {
    const length = caption.length;
    let score = 75;
    const strengths: string[] = ['Clear messaging intent'];
    const improvements: string[] = [];

    if (length > 20 && length < 500) {
      score += 15;
      strengths.push('Optimal character length for engagement');
    } else if (length >= 500) {
      score -= 10;
      improvements.push('Consider shortening text for mobile skimmers');
    }

    if (caption.includes('?') || caption.toLowerCase().includes('comment')) {
      score += 10;
      strengths.push('Includes strong call-to-action or question prompt');
    } else {
      improvements.push('Add an engaging question at the end to boost comments');
    }

    score = Math.min(100, Math.max(0, score));

    let rating: 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'POOR' = 'GOOD';
    if (score >= 90) rating = 'EXCELLENT';
    else if (score >= 75) rating = 'GOOD';
    else if (score >= 50) rating = 'NEEDS_IMPROVEMENT';
    else rating = 'POOR';

    return { score, rating, strengths, improvements };
  }

  async recommendBestPostingTime(
    platform: string,
    timezone = 'UTC',
  ): Promise<{ bestDay: string; bestHour: string; confidenceScore: number }> {
    const timeMap: Record<string, { day: string; hour: string }> = {
      INSTAGRAM: { day: 'Wednesday', hour: '11:00 AM' },
      TIKTOK: { day: 'Tuesday', hour: '7:00 PM' },
      YOUTUBE: { day: 'Friday', hour: '3:00 PM' },
      X: { day: 'Thursday', hour: '9:00 AM' },
      LINKEDIN: { day: 'Tuesday', hour: '10:00 AM' },
    };

    const rec = timeMap[platform] || { day: 'Wednesday', hour: '2:00 PM' };
    return {
      bestDay: rec.day,
      bestHour: rec.hour,
      confidenceScore: 0.92,
    };
  }

  async repurposeText(
    sourceText: string,
    targetPlatforms: string[],
  ): Promise<Record<string, string>> {
    const result: Record<string, string> = {};
    for (const p of targetPlatforms) {
      result[p] = `[Adapted for ${p}]: ${sourceText.substring(0, 150)}...`;
    }
    return result;
  }

  async generateImagePrompt(concept: string, style = 'photorealistic'): Promise<string> {
    return `High-resolution ${style} image depicting ${concept}, dramatic lighting, 8k render, professional composition`;
  }
}
