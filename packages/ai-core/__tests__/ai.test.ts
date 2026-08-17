import { MockAIProvider, TONE_SPECS } from '../src';

describe('AI Core Provider', () => {
  const provider = new MockAIProvider();

  it('should adapt caption with proper tone and hashtags', async () => {
    const result = await provider.adaptCaption('Launching a new product today!', 'X', 'Viral');
    expect(result.adaptedCaption).toContain('[X - Viral]');
    expect(result.hashtags).toContain('#x');
    expect(result.hashtags).toContain('#viral');
  });

  it('should calculate content score and provide feedback', async () => {
    const scoreResult = await provider.calculateContentScore(
      'Check out this great new update! What do you think?',
      'INSTAGRAM',
    );
    expect(scoreResult.score).toBeGreaterThan(0);
    expect(scoreResult.rating).toBeDefined();
    expect(scoreResult.strengths.length).toBeGreaterThan(0);
  });

  it('should recommend best posting times', async () => {
    const rec = await provider.recommendBestPostingTime('INSTAGRAM');
    expect(rec.bestDay).toBe('Wednesday');
    expect(rec.bestHour).toBe('11:00 AM');
    expect(rec.confidenceScore).toBeGreaterThan(0.8);
  });

  it('should generate high-quality image prompts', async () => {
    const prompt = await provider.generateImagePrompt('cyberpunk city skyline', 'cinematic');
    expect(prompt).toContain('cyberpunk city skyline');
    expect(prompt).toContain('cinematic');
  });
});
