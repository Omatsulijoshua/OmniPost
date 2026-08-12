import { Test, TestingModule } from '@nestjs/testing';
import { SocialAccountService } from './social-account.service';
import { CryptoService } from './crypto.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('SocialAccountService', () => {
  let service: SocialAccountService;
  let cryptoService: CryptoService;

  const mockPrismaService = {
    platform: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    socialAccount: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    platformCredential: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocialAccountService,
        CryptoService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SocialAccountService>(SocialAccountService);
    cryptoService = module.get<CryptoService>(CryptoService);
    jest.clearAllMocks();
  });

  it('should encrypt and decrypt tokens correctly using AES-256-GCM', () => {
    const rawToken = 'secret_access_token_123';
    const encrypted = cryptoService.encrypt(rawToken);
    expect(encrypted).not.toBe(rawToken);

    const decrypted = cryptoService.decrypt(encrypted);
    expect(decrypted).toBe(rawToken);
  });

  it('should connect a mock social account', async () => {
    mockPrismaService.platform.findUnique.mockResolvedValue({
      id: 'plat-insta',
      type: 'INSTAGRAM',
      name: 'Instagram',
      capabilities: {},
    });

    const mockAccount = {
      id: 'acc-insta',
      workspaceId: 'ws-1',
      platformId: 'plat-insta',
      accountName: '@creator_official',
      externalId: 'mock-ext-123',
      isMock: true,
      profileUrl: 'https://instagram.com/creator_official',
      avatarUrl: null,
      platform: {
        id: 'plat-insta',
        type: 'INSTAGRAM',
        name: 'Instagram',
        capabilities: {},
      },
      credentials: {
        id: 'cred-1',
        encryptedToken: 'enc_token',
        expiresAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrismaService.socialAccount.create.mockResolvedValue(mockAccount);

    const result = await service.connectMockAccount('ws-1', {
      platformType: 'INSTAGRAM',
      accountName: '@creator_official',
    });

    expect(result.id).toBe('acc-insta');
    expect(result.accountName).toBe('@creator_official');
    expect(result.isMock).toBe(true);
  });

  it('should disconnect a social account', async () => {
    mockPrismaService.socialAccount.findFirst.mockResolvedValue({
      id: 'acc-1',
      workspaceId: 'ws-1',
    });

    await service.disconnectAccount('ws-1', 'acc-1');

    expect(mockPrismaService.socialAccount.delete).toHaveBeenCalledWith({
      where: { id: 'acc-1' },
    });
  });

  it('should throw NotFoundException when disconnecting invalid account', async () => {
    mockPrismaService.socialAccount.findFirst.mockResolvedValue(null);

    await expect(service.disconnectAccount('ws-1', 'invalid')).rejects.toThrow(
      NotFoundException,
    );
  });
});
