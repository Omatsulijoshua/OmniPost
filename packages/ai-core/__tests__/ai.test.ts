import { BaseAIProvider, ContentScore, ToneType } from '../src';
import { PlatformType } from '@omnipost/types';

class MockAIProvider extends BaseAIProvider {
  providerName: 'OpenAI' = 'OpenAI';

  async generateCaption(prompt: string, tone?: ToneType): Promise<string> {
    return `[${tone || 'Casual'}] ${prompt}`;
  }
  async adaptCaption(caption: string, options: any): Promise<string> {
    return `[${options.targetPlatform}] ${caption}`;
  }
  async generateHashtags(): Promise<string[]> {
    return ['#tech', '#omnipost'];
  }
  async generateTitleAndDescription(): Promise<{ title: string; description: string }> {
    return { title: 'Test Title', description: 'Test Description' };
  }
  async calculateContentScore(caption: string, platform: PlatformType): Promise<ContentScore> {
    return {
      overallScore: 85,
      breakdown: { hook: 90, clarity: 85, engagement: 80, platformFit: 85, cta: 85 },
      explanation: `Good quality post for ${platform}: ${caption}`,
      suggestions: ['Add stronger call to action'],
    };
  }
}

describe('AI Core Abstractions', () => {
  it('should generate adapted caption correctly', async () => {
    const ai = new MockAIProvider();
    const result = await ai.adaptCaption('Original post', { targetPlatform: 'INSTAGRAM' });
    expect(result).toBe('[INSTAGRAM] Original post');
    const score = await ai.calculateContentScore('Original post', 'INSTAGRAM');
    expect(score.overallScore).toBe(85);
  });
});
