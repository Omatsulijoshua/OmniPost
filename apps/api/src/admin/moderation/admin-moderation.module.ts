import { Module } from '@nestjs/common';
import { AdminModerationService } from './admin-moderation.service';
import { AdminModerationController } from './admin-moderation.controller';
import { AdminAuthModule } from '../auth/admin-auth.module';

@Module({
  imports: [AdminAuthModule],
  controllers: [AdminModerationController],
  providers: [AdminModerationService],
  exports: [AdminModerationService],
})
export class AdminModerationModule {}
