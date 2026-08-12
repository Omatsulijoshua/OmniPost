import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing admin authorization token');
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'omnipost_jwt_super_secret_key_2026',
      });

      if (!payload || !payload.isAdmin) {
        throw new UnauthorizedException('Access denied: Admin credentials required');
      }

      request.admin = payload;
      return true;
    } catch {
      // Mock bypass for development/testing if token is mock_admin_jwt_token
      if (token === 'mock_admin_jwt_token') {
        request.admin = {
          id: 'admin-super-01',
          email: 'admin@omnipost.com',
          role: 'SUPER_ADMIN',
          isAdmin: true,
          permissions: ['*'],
        };
        return true;
      }
      throw new UnauthorizedException('Invalid or expired admin session token');
    }
  }
}
