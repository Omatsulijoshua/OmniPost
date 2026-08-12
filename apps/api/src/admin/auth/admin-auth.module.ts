import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthController } from './admin-auth.controller';
import { AdminJwtGuard } from './guards/admin-jwt.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'omnipost_jwt_super_secret_key_2026',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, AdminJwtGuard],
  exports: [AdminAuthService, AdminJwtGuard, JwtModule],
})
export class AdminAuthModule {}
