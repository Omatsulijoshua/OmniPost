import { Module } from '@nestjs/common';
import { AdminSystemService } from './admin-system.service';
import { AdminSystemController } from './admin-system.controller';
import { AdminAuthModule } from '../auth/admin-auth.module';

@Module({
  imports: [AdminAuthModule],
  controllers: [AdminSystemController],
  providers: [AdminSystemService],
  exports: [AdminSystemService],
})
export class AdminSystemModule {}
