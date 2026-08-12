import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [PrismaModule, AuthModule, WorkspaceModule, DashboardModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
