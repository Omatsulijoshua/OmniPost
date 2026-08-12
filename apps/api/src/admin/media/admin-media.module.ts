import { Module } from '@nestjs/common';
import { AdminMediaService } from './admin-media.service';
import { AdminMediaController } from './admin-media.controller';
import { AdminAuthModule } from '../auth/admin-auth.module';

@Module({
  imports: [AdminAuthModule],
  controllers: [AdminMediaController],
  providers: [AdminMediaService],
  exports: [AdminMediaService],
})
export class AdminMediaModule {}
