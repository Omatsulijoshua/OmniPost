import { TranscodingPresetName, TranscodingPresetSpec } from '@omnipost/types';

export const TRANSCODING_PRESETS: Record<TranscodingPresetName, TranscodingPresetSpec> = {
  VERTICAL_SHORT_VIDEO: {
    preset: 'VERTICAL_SHORT_VIDEO',
    name: 'Vertical Short Video (9:16)',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    mediaType: 'video',
  },
  LANDSCAPE_VIDEO: {
    preset: 'LANDSCAPE_VIDEO',
    name: 'Landscape Video (16:9)',
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    mediaType: 'video',
  },
  SQUARE_VIDEO: {
    preset: 'SQUARE_VIDEO',
    name: 'Square Video (1:1)',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    mediaType: 'video',
  },
  INSTAGRAM_REEL: {
    preset: 'INSTAGRAM_REEL',
    name: 'Instagram Reel (9:16)',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    mediaType: 'video',
  },
  TIKTOK_VIDEO: {
    preset: 'TIKTOK_VIDEO',
    name: 'TikTok Video (9:16)',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    mediaType: 'video',
  },
  YOUTUBE_SHORT: {
    preset: 'YOUTUBE_SHORT',
    name: 'YouTube Short (9:16)',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    mediaType: 'video',
  },
  SQUARE_IMAGE: {
    preset: 'SQUARE_IMAGE',
    name: 'Square Image (1:1)',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    mediaType: 'image',
  },
  STORY_IMAGE: {
    preset: 'STORY_IMAGE',
    name: 'Story / Reel Image (9:16)',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    mediaType: 'image',
  },
};

export class MediaProcessor {
  static getPresetSpec(preset: TranscodingPresetName): TranscodingPresetSpec {
    return TRANSCODING_PRESETS[preset] || TRANSCODING_PRESETS.SQUARE_IMAGE;
  }

  static processVariantFallback(
    originalUrl: string,
    preset: TranscodingPresetName,
  ): { variantUrl: string; width: number; height: number; aspectRatio: string; format: string } {
    const spec = this.getPresetSpec(preset);
    const ext = spec.mediaType === 'video' ? 'mp4' : 'jpg';
    const variantUrl = `${originalUrl}_variant_${preset.toLowerCase()}.${ext}`;

    return {
      variantUrl,
      width: spec.width,
      height: spec.height,
      aspectRatio: spec.aspectRatio,
      format: ext,
    };
  }
}
