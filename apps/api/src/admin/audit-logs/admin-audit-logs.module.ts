import { Module } from '@nestjs/common';
import { AdminAuditLogsService } from './admin-audit-logs.service';
import { AdminAuditLogsController } from './admin-audit-logs.controller';
import { AdminAuthModule } from '../auth/admin-auth.module';

@Module({
  imports: [AdminAuthModule],
  controllers: [AdminAuditLogsController],
  providers: [AdminAuditLogsService],
  exports: [AdminAuditLogsService],
})
export class AdminAuditLogsModule {}
