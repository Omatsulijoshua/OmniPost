import { Module } from '@nestjs/common';
import { AdminPlatformsService } from './admin-platforms.service';
import { AdminPlatformsController } from './admin-platforms.controller';
import { AdminAuthModule } from '../auth/admin-auth.module';

@Module({
  imports: [AdminAuthModule],
  controllers: [AdminPlatformsController],
  providers: [AdminPlatformsService],
  exports: [AdminPlatformsService],
})
export class AdminPlatformsModule {}
