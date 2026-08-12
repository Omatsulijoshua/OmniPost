import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MediaModule } from './media/media.module';
import { SocialAccountModule } from './social-account/social-account.module';
import { PostModule } from './post/post.module';
import { AIModule } from './ai/ai.module';
import { TranscodingModule } from './transcoding/transcoding.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { PublishingModule } from './publishing/publishing.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ApprovalModule } from './approval/approval.module';
import { BrandModule } from './brand/brand.module';
import { BillingModule } from './billing/billing.module';
import { AdminAuthModule } from './admin/auth/admin-auth.module';
import { AdminDashboardModule } from './admin/dashboard/admin-dashboard.module';
import { AdminUsersModule } from './admin/users/admin-users.module';
import { AdminWorkspacesModule } from './admin/workspaces/admin-workspaces.module';
import { AdminPlatformsModule } from './admin/platforms/admin-platforms.module';
import { AdminSocialAccountsModule } from './admin/social-accounts/admin-social-accounts.module';
import { AdminPublishingModule } from './admin/publishing/admin-publishing.module';
import { AdminMediaModule } from './admin/media/admin-media.module';
import { AdminAiModule } from './admin/ai/admin-ai.module';
import { AdminAnalyticsModule } from './admin/analytics/admin-analytics.module';
import { AdminBillingModule } from './admin/billing/admin-billing.module';
import { AdminModerationModule } from './admin/moderation/admin-moderation.module';
import { AdminAuditLogsModule } from './admin/audit-logs/admin-audit-logs.module';
import { AdminSystemModule } from './admin/system/admin-system.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    WorkspaceModule,
    DashboardModule,
    MediaModule,
    SocialAccountModule,
    PostModule,
    AIModule,
    TranscodingModule,
    SchedulerModule,
    PublishingModule,
    AnalyticsModule,
    ApprovalModule,
    BrandModule,
    BillingModule,
    AdminAuthModule,
    AdminDashboardModule,
    AdminUsersModule,
    AdminWorkspacesModule,
    AdminPlatformsModule,
    AdminSocialAccountsModule,
    AdminPublishingModule,
    AdminMediaModule,
    AdminAiModule,
    AdminAnalyticsModule,
    AdminBillingModule,
    AdminModerationModule,
    AdminAuditLogsModule,
    AdminSystemModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
