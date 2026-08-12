import { Module } from '@nestjs/common';
import { AdminPublishingService } from './admin-publishing.service';
import { AdminPublishingController } from './admin-publishing.controller';
import { AdminAuthModule } from '../auth/admin-auth.module';

@Module({
  imports: [AdminAuthModule],
  controllers: [AdminPublishingController],
  providers: [AdminPublishingService],
  exports: [AdminPublishingService],
})
export class AdminPublishingModule {}
