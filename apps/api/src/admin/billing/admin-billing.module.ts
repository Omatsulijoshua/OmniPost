import { Module } from '@nestjs/common';
import { AdminBillingService } from './admin-billing.service';
import { AdminBillingController } from './admin-billing.controller';
import { AdminAuthModule } from '../auth/admin-auth.module';

@Module({
  imports: [AdminAuthModule],
  controllers: [AdminBillingController],
  providers: [AdminBillingService],
  exports: [AdminBillingService],
})
export class AdminBillingModule {}
