import { PlatformType, PublishingResult } from '@omnipost/types';

export interface PublishOptions {
  caption: string;
  title?: string;
  mediaUrls?: string[];
  hashtags?: string[];
  credentials?: Record<string, any>;
  isMock?: boolean;
}

export abstract class PlatformPublisherAdapter {
  abstract readonly platformType: PlatformType;

  abstract publish(options: PublishOptions): Promise<PublishingResult>;
}

export class MockPlatformPublisher extends PlatformPublisherAdapter {
  constructor(public readonly platformType: PlatformType) {
    super();
  }

  async publish(options: PublishOptions): Promise<PublishingResult> {
    if (options.caption.includes('FAIL_TRIGGER')) {
      return {
        success: false,
        errorMessage: `Mock publishing failure triggered for ${this.platformType}`,
        retryCount: 3,
      };
    }

    const randomId = Math.random().toString(36).substring(2, 10);
    return {
      success: true,
      externalPostId: `${this.platformType.toLowerCase()}-${randomId}`,
      externalPostUrl: `https://${this.platformType.toLowerCase()}.com/p/${randomId}`,
      retryCount: 0,
    };
  }
}

export class PublishingRetryEngine {
  static async executeWithRetry(
    publisher: PlatformPublisherAdapter,
    options: PublishOptions,
    maxRetries = 3,
  ): Promise<PublishingResult> {
    let attempt = 0;
    let lastError = 'Unknown error';

    while (attempt < maxRetries) {
      try {
        const result = await publisher.publish(options);
        if (result.success) return result;
        lastError = result.errorMessage || lastError;
      } catch (err: any) {
        lastError = err.message || 'Network exception';
      }

      attempt++;
      if (attempt < maxRetries) {
        const delayMs = Math.pow(2, attempt) * 100;
        await new Promise((resolve) => {
          (globalThis as any).setTimeout(resolve, delayMs);
        });
      }
    }

    return {
      success: false,
      errorMessage: `Failed after ${maxRetries} retries: ${lastError}`,
      retryCount: attempt,
    };
  }
}

export class PublisherFactory {
  static getPublisher(platformType: PlatformType): PlatformPublisherAdapter {
    return new MockPlatformPublisher(platformType);
  }
}
