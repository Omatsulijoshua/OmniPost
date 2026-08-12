import { BasePlatformAdapter, PostPayload } from '../src';
import { PlatformCapabilities, PlatformType } from '@omnipost/types';

class TestMockAdapter extends BasePlatformAdapter {
  platformType: PlatformType = 'X';

  async connect() {
    return { accountId: '123', accountName: 'Test', tokenData: {} };
  }
  async refreshToken() {
    return {};
  }
  async validateContent(payload: PostPayload) {
    return { valid: payload.caption.length <= 280 };
  }
  getCapabilities(): PlatformCapabilities {
    return {
      supportsImages: true,
      supportsVideos: true,
      supportsStories: false,
      supportsShorts: false,
      supportsReels: false,
      supportsScheduling: true,
      supportsDirectPublishing: true,
      supportsAnalytics: true,
      supportsComments: true,
      supportsDeletion: true,
      maxVideoSizeMB: 512,
      maxVideoDurationSeconds: 140,
      supportedAspectRatios: ['16:9', '1:1'],
      requiresBusinessAccount: false,
      requiresAppReview: false,
    };
  }
  async prepareMedia(urls: string[]) {
    return urls;
  }
  async publish() {
    return { success: true, externalPostId: 'ext_123' };
  }
  async schedule() {
    return { success: true, externalPostId: 'ext_sched_123' };
  }
  async getPublishStatus() {
    return { success: true };
  }
  async deletePost() {
    return true;
  }
  async getAnalytics() {
    return { views: 100 };
  }
}

describe('PlatformAdapter Base Class', () => {
  it('should instantiate and validate payload correctly', async () => {
    const adapter = new TestMockAdapter();
    const result = await adapter.validateContent({
      postId: '1',
      versionId: '1',
      caption: 'Hello World',
      mediaUrls: [],
    });
    expect(result.valid).toBe(true);
    expect(adapter.getCapabilities().maxVideoSizeMB).toBe(512);
  });
});
