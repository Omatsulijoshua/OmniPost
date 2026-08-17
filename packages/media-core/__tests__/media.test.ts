import { TRANSCODING_PRESETS, MediaProcessor } from '../src';

describe('Media Presets', () => {
  it('should define INSTAGRAM_REEL preset properly', () => {
    const reel = TRANSCODING_PRESETS.INSTAGRAM_REEL;
    expect(reel.width).toBe(1080);
    expect(reel.height).toBe(1920);
    expect(reel.aspectRatio).toBe('9:16');
  });

  it('should process variant fallback accurately', () => {
    const original = 'https://cdn.omnipost.io/video123';
    const result = MediaProcessor.processVariantFallback(original, 'TIKTOK_VIDEO');
    expect(result.variantUrl).toContain('variant_tiktok_video.mp4');
    expect(result.width).toBe(1080);
    expect(result.height).toBe(1920);
  });
});
