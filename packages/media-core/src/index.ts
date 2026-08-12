export type MediaPreset =
  | 'VERTICAL_SHORT_VIDEO'
  | 'LANDSCAPE_VIDEO'
  | 'SQUARE_VIDEO'
  | 'INSTAGRAM_REEL'
  | 'YOUTUBE_SHORT'
  | 'TIKTOK_VIDEO';

export interface PresetConfig {
  preset: MediaPreset;
  width: number;
  height: number;
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:5';
  maxDurationSeconds: number;
  videoCodec: string;
  audioCodec: string;
  format: 'mp4';
}

export const MEDIA_PRESETS: Record<MediaPreset, PresetConfig> = {
  VERTICAL_SHORT_VIDEO: {
    preset: 'VERTICAL_SHORT_VIDEO',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    maxDurationSeconds: 60,
    videoCodec: 'libx264',
    audioCodec: 'aac',
    format: 'mp4',
  },
  LANDSCAPE_VIDEO: {
    preset: 'LANDSCAPE_VIDEO',
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    maxDurationSeconds: 600,
    videoCodec: 'libx264',
    audioCodec: 'aac',
    format: 'mp4',
  },
  SQUARE_VIDEO: {
    preset: 'SQUARE_VIDEO',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    maxDurationSeconds: 120,
    videoCodec: 'libx264',
    audioCodec: 'aac',
    format: 'mp4',
  },
  INSTAGRAM_REEL: {
    preset: 'INSTAGRAM_REEL',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    maxDurationSeconds: 90,
    videoCodec: 'libx264',
    audioCodec: 'aac',
    format: 'mp4',
  },
  YOUTUBE_SHORT: {
    preset: 'YOUTUBE_SHORT',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    maxDurationSeconds: 60,
    videoCodec: 'libx264',
    audioCodec: 'aac',
    format: 'mp4',
  },
  TIKTOK_VIDEO: {
    preset: 'TIKTOK_VIDEO',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    maxDurationSeconds: 180,
    videoCodec: 'libx264',
    audioCodec: 'aac',
    format: 'mp4',
  },
};
