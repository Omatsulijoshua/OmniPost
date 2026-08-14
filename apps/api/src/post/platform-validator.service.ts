import { Injectable } from '@nestjs/common';
import { PlatformType, PlatformValidationError } from '@omnipost/types';

@Injectable()
export class PlatformValidatorService {
  private readonly platformCharLimits: Record<PlatformType, number> = {
    X: 280,
    INSTAGRAM: 2200,
    TIKTOK: 2200,
    LINKEDIN: 3000,
    FACEBOOK: 63206,
    YOUTUBE: 5000,
    THREADS: 500,
    PINTEREST: 500,
    TELEGRAM: 4096,
    DISCORD: 2000,
    SLACK: 40000,
    REDDIT: 40000,
    GOOGLE_BUSINESS: 1500,
    OTHER: 5000,
  };

  validatePostVersion(
    platformType: PlatformType,
    caption: string,
    title?: string | null,
  ): PlatformValidationError[] {
    const errors: PlatformValidationError[] = [];
    const maxChars = this.platformCharLimits[platformType] || 2000;

    if (caption.length > maxChars) {
      errors.push({
        platformType,
        field: 'caption',
        message: `Caption exceeds max character limit of ${maxChars} for ${platformType} (current length: ${caption.length}).`,
      });
    }

    if (platformType === 'YOUTUBE' && !title) {
      errors.push({
        platformType,
        field: 'title',
        message: 'A title is required for YouTube video posts.',
      });
    }

    if (platformType === 'PINTEREST' && !title) {
      errors.push({
        platformType,
        field: 'title',
        message: 'A title is required for Pinterest Pin posts.',
      });
    }

    return errors;
  }
}
