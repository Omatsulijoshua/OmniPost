import { Module } from '@nestjs/common';
import { AdminAiService } from './admin-ai.service';
import { AdminAiController } from './admin-ai.controller';
import { AdminAuthModule } from '../auth/admin-auth.module';

@Module({
  imports: [AdminAuthModule],
  controllers: [AdminAiController],
  providers: [AdminAiService],
  exports: [AdminAiService],
})
export class AdminAiModule {}
