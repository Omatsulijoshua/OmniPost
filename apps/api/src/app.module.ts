import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MediaModule } from './media/media.module';
import { SocialAccountModule } from './social-account/social-account.module';
import { PostModule } from './post/post.module';
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
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
