import { PlatformType } from '@omnipost/types';

export type ToneType =
  | 'Professional'
  | 'Friendly'
  | 'Funny'
  | 'Educational'
  | 'Luxury'
  | 'Persuasive'
  | 'Casual'
  | 'Viral'
  | 'Minimal';

export interface AdaptationOptions {
  targetPlatform: PlatformType;
  tone?: ToneType;
  includeHashtags?: boolean;
  maxLength?: number;
  brandVoiceInstructions?: string;
}

export interface ContentScore {
  overallScore: number;
  breakdown: {
    hook: number;
    clarity: number;
    engagement: number;
    platformFit: number;
    cta: number;
  };
  explanation: string;
  suggestions: string[];
}

export interface AIProvider {
  providerName: 'OpenAI' | 'Gemini';

  generateCaption(prompt: string, tone?: ToneType): Promise<string>;
  adaptCaption(originalCaption: string, options: AdaptationOptions): Promise<string>;
  generateHashtags(topicOrCaption: string, platform: PlatformType, count?: number): Promise<string[]>;
  generateTitleAndDescription(contentSummary: string, platform: PlatformType): Promise<{ title: string; description: string }>;
  calculateContentScore(caption: string, platform: PlatformType): Promise<ContentScore>;
}

export abstract class BaseAIProvider implements AIProvider {
  abstract providerName: 'OpenAI' | 'Gemini';

  abstract generateCaption(prompt: string, tone?: ToneType): Promise<string>;
  abstract adaptCaption(originalCaption: string, options: AdaptationOptions): Promise<string>;
  abstract generateHashtags(topicOrCaption: string, platform: PlatformType, count?: number): Promise<string[]>;
  abstract generateTitleAndDescription(contentSummary: string, platform: PlatformType): Promise<{ title: string; description: string }>;
  abstract calculateContentScore(caption: string, platform: PlatformType): Promise<ContentScore>;
}
