import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrismaService = {
    role: {
      upsert: jest.fn().mockResolvedValue({ id: 'role-1', name: 'OWNER' }),
      findUniqueOrThrow: jest.fn().mockResolvedValue({ id: 'role-1', name: 'OWNER' }),
    },
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    workspace: {
      create: jest.fn(),
    },
    workspaceMember: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked-token'),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should register a new user and create default workspace', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(null);
    mockPrismaService.user.create.mockResolvedValue({
      id: 'user-123',
      email: 'creator@omnipost.io',
      name: 'Creator One',
      avatarUrl: null,
      emailVerified: false,
      twoFactorEnabled: false,
    });
    mockPrismaService.workspace.create.mockResolvedValue({
      id: 'ws-123',
      name: "Creator One's Workspace",
      slug: 'ws-user-123',
      createdAt: new Date(),
    });

    const result = await service.register({
      email: 'creator@omnipost.io',
      password: 'password123',
      name: 'Creator One',
    });

    expect(result.user.email).toBe('creator@omnipost.io');
    expect(result.defaultWorkspace.role).toBe('OWNER');
    expect(result.tokens.accessToken).toBe('mocked-token');
  });

  it('should throw ConflictException if registering existing email', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue({ id: 'user-existing' });

    await expect(
      service.register({
        email: 'creator@omnipost.io',
        password: 'password123',
        name: 'Creator One',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw UnauthorizedException for invalid login credentials', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(null);

    await expect(
      service.login({
        email: 'wrong@omnipost.io',
        password: 'invalidpassword',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
