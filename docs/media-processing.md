# Media Processing Pipeline

OmniPost transcodes uploaded video and image media into platform-optimized variants using FFmpeg.

## Transcoding Presets

- `VERTICAL_SHORT_VIDEO` (1080x1920, 9:16) -> Reels / Shorts / TikTok
- `LANDSCAPE_VIDEO` (1920x1080, 16:9) -> YouTube / LinkedIn / Web
- `SQUARE_VIDEO` (1080x1080, 1:1) -> Feed posts
- `INSTAGRAM_REEL` (1080x1920, 9:16, max 90s)
- `YOUTUBE_SHORT` (1080x1920, 9:16, max 60s)
- `TIKTOK_VIDEO` (1080x1920, 9:16, max 180s)
