import { MEDIA_PRESETS } from '../src';

describe('Media Presets', () => {
  it('should define INSTAGRAM_REEL preset properly', () => {
    const reel = MEDIA_PRESETS.INSTAGRAM_REEL;
    expect(reel.width).toBe(1080);
    expect(reel.height).toBe(1920);
    expect(reel.aspectRatio).toBe('9:16');
  });
});
