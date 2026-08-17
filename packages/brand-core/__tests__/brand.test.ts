import { BrandEngine, PREMADE_VIRAL_TEMPLATES } from '../src';

describe('BrandEngine', () => {
  it('should return predefined viral templates', () => {
    const templates = BrandEngine.getPremadeTemplates();
    expect(templates.length).toBeGreaterThan(0);
    expect(templates[0].name).toBeDefined();
    expect(templates[0].templateData.caption).toBeDefined();
  });

  it('should apply watermark spec correctly', () => {
    const media = 'https://cdn.omnipost.io/video.mp4';
    const watermark = 'https://cdn.omnipost.io/logo.png';
    const result = BrandEngine.applyWatermarkSpec(media, watermark);
    expect(result).toContain('_watermarked_by_');

    const noWatermark = BrandEngine.applyWatermarkSpec(media, null);
    expect(noWatermark).toBe(media);
  });
});
