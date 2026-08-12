import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MediaModule } from './media/media.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    WorkspaceModule,
    DashboardModule,
    MediaModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
