import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [PrismaModule, AuthModule, WorkspaceModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
