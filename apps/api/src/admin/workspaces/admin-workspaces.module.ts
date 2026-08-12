import { Module } from '@nestjs/common';
import { AdminWorkspacesService } from './admin-workspaces.service';
import { AdminWorkspacesController } from './admin-workspaces.controller';
import { AdminAuthModule } from '../auth/admin-auth.module';

@Module({
  imports: [AdminAuthModule],
  controllers: [AdminWorkspacesController],
  providers: [AdminWorkspacesService],
  exports: [AdminWorkspacesService],
})
export class AdminWorkspacesModule {}
