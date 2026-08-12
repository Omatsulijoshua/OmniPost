# Platform Integrations Architecture

OmniPost uses a plugin-style platform adapter framework.

## Supported Platform Adapters

- Instagram (Graph API)
- TikTok (Content Posting API)
- YouTube (Data API v3)
- X (v2 API)
- LinkedIn (v2 API)
- Threads (Graph API)
- Pinterest
- Telegram (Bot API)
- Discord (Webhooks / Bot API)
- Slack (Web APIs)
- Reddit
- Google Business Profile

Each adapter enforces `PlatformCapabilities` (max video duration, aspect ratio, scheduling support) dynamically.
