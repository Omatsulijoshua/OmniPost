import { PlatformCapabilities, PlatformType } from '../src';

describe('Types exports', () => {
  it('should construct valid PlatformCapabilities', () => {
    const caps: PlatformCapabilities = {
      supportsImages: true,
      supportsVideos: true,
      supportsStories: false,
      supportsShorts: false,
      supportsReels: true,
      supportsScheduling: true,
      supportsDirectPublishing: true,
      supportsAnalytics: true,
      supportsComments: true,
      supportsDeletion: true,
      maxVideoSizeMB: 100,
      maxVideoDurationSeconds: 90,
      supportedAspectRatios: ['9:16', '1:1'],
      requiresBusinessAccount: true,
      requiresAppReview: false,
    };
    expect(caps.supportsReels).toBe(true);
  });
});
