import { Test, TestingModule } from '@nestjs/testing';
import { AdminSocialAccountsService } from './admin-social-accounts.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AdminSocialAccountsService', () => {
  let service: AdminSocialAccountsService;

  const mockPrismaService = {
    socialAccount: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminSocialAccountsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AdminSocialAccountsService>(AdminSocialAccountsService);
    jest.clearAllMocks();
  });

  it('should list connected social accounts with masked token status', async () => {
    mockPrismaService.socialAccount.findMany.mockResolvedValue([]);

    const res = await service.listSocialAccounts({ page: 1, limit: 10 });

    expect(res.items.length).toBeGreaterThan(0);
    expect(res.items[0].tokenStatus).toContain('••••••••');
  });

  it('should return token health summary telemetry', async () => {
    const summary = await service.getTokenHealthSummary();

    expect(summary.totalConnected).toBeGreaterThan(0);
    expect(summary.healthScorePercent).toBeGreaterThan(90);
  });
});
