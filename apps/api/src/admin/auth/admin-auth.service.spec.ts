import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { AdminAuthService } from './admin-auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AdminAuthService', () => {
  let service: AdminAuthService;

  const mockPrismaService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({ secret: 'omnipost_jwt_super_secret_key_2026' }),
      ],
      providers: [
        AdminAuthService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AdminAuthService>(AdminAuthService);
  });

  it('should authenticate admin user and return JWT session token', async () => {
    const result = await service.login('admin@omnipost.com', 'password123');

    expect(result.token).toBeDefined();
    expect(result.admin?.role).toBe('SUPER_ADMIN');
    expect(result.admin?.permissions.length).toBeGreaterThan(0);
  });

  it('should reject non-admin email logins with UnauthorizedException', async () => {
    await expect(
      service.login('customer@external.com', 'password123'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should verify MFA code 123456', async () => {
    const result = await service.verifyMfa('admin@omnipost.com', '123456');

    expect(result.token).toBeDefined();
    expect(result.admin?.email).toBe('admin@omnipost.com');
  });
});
