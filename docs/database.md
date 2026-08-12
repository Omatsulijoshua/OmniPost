# Database Architecture & Entity Models

PostgreSQL serves as the primary relational database, managed via Prisma ORM.

## Key Entity Groups

- **Identity & Access**: User, Workspace, WorkspaceMember, Role, Permission.
- **Social Integration**: SocialAccount, Platform, PlatformCredential.
- **Content Management**: Post, PostVersion, MediaAsset, MediaVariant, Caption, Hashtag, Folder.
- **Publishing & Queue**: Schedule, PublishingJob, PublishingAttempt, PublishingError.
- **Analytics & AI**: AnalyticsSnapshot, AnalyticsMetric, AIJob, AIRecommendation.
- **Organization & Billing**: BrandKit, ContentTemplate, Client, Subscription, Plan, Invoice, AuditLog, WebhookEvent.
