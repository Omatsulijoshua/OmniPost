import { Module } from '@nestjs/common';
import { AdminAnalyticsService } from './admin-analytics.service';
import { AdminAnalyticsController } from './admin-analytics.controller';
import { AdminAuthModule } from '../auth/admin-auth.module';

@Module({
  imports: [AdminAuthModule],
  controllers: [AdminAnalyticsController],
  providers: [AdminAnalyticsService],
  exports: [AdminAnalyticsService],
})
export class AdminAnalyticsModule {}
