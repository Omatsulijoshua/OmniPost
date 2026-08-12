import { Module } from '@nestjs/common';
import { AdminSocialAccountsService } from './admin-social-accounts.service';
import { AdminSocialAccountsController } from './admin-social-accounts.controller';
import { AdminAuthModule } from '../auth/admin-auth.module';

@Module({
  imports: [AdminAuthModule],
  controllers: [AdminSocialAccountsController],
  providers: [AdminSocialAccountsService],
  exports: [AdminSocialAccountsService],
})
export class AdminSocialAccountsModule {}
