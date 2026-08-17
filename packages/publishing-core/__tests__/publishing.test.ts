import { PublisherFactory, PublishingRetryEngine, MockPlatformPublisher } from '../src';

describe('PublishingCore', () => {
  it('should instantiate publisher adapter from factory', () => {
    const publisher = PublisherFactory.getPublisher('TIKTOK' as any);
    expect(publisher).toBeDefined();
    expect(publisher.platformType).toBe('TIKTOK');
  });

  it('should successfully publish via mock adapter', async () => {
    const publisher = new MockPlatformPublisher('INSTAGRAM' as any);
    const result = await publisher.publish({
      caption: 'Test post on Instagram',
    });

    expect(result.success).toBe(true);
    expect(result.externalPostId).toContain('instagram-');
  });

  it('should retry on failure with exponential backoff', async () => {
    const publisher = new MockPlatformPublisher('X' as any);
    const result = await PublishingRetryEngine.executeWithRetry(
      publisher,
      {
        caption: 'FAIL_TRIGGER test retry',
      },
      2,
    );

    expect(result.success).toBe(false);
    expect(result.retryCount).toBe(2);
  });
});
