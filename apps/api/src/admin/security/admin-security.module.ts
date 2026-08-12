import { Module } from '@nestjs/common';
import { AdminSecurityService } from './admin-security.service';
import { AdminSecurityController } from './admin-security.controller';
import { AdminAuthModule } from '../auth/admin-auth.module';

@Module({
  imports: [AdminAuthModule],
  controllers: [AdminSecurityController],
  providers: [AdminSecurityService],
  exports: [AdminSecurityService],
})
export class AdminSecurityModule {}
