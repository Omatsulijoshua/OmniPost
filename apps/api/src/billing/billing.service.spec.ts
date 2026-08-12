import { Test, TestingModule } from '@nestjs/testing';
import { BillingService } from './billing.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BillingService', () => {
  let service: BillingService;

  const mockPrismaService = {
    subscription: {
      findFirst: jest.fn(),
      updateMany: jest.fn(),
    },
    post: {
      count: jest.fn(),
    },
    socialAccount: {
      count: jest.fn(),
    },
    workspaceMember: {
      count: jest.fn(),
    },
    mediaAsset: {
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<BillingService>(BillingService);
    jest.clearAllMocks();
  });

  it('should return subscription details and calculated usage quotas', async () => {
    mockPrismaService.subscription.findFirst.mockResolvedValue({
      id: 'sub-1',
      workspaceId: 'ws-1',
      plan: { name: 'PRO' },
      status: 'ACTIVE',
      currentPeriodEnd: new Date(),
    });
    mockPrismaService.post.count.mockResolvedValue(45);
    mockPrismaService.socialAccount.count.mockResolvedValue(5);
    mockPrismaService.workspaceMember.count.mockResolvedValue(3);
    mockPrismaService.mediaAsset.count.mockResolvedValue(20);

    const sub = await service.getSubscription('ws-1');

    expect(sub.tier).toBe('PRO');
    expect(sub.monthlyPriceUSD).toBe(79);
    expect(sub.quota.postsThisMonth).toBe(45);
    expect(sub.quota.maxPostsPerMonth).toBe(500);
  });

  it('should generate Stripe checkout URL for plan upgrades', async () => {
    const session = await service.createCheckoutSession('ws-1', {
      targetTier: 'AGENCY',
      billingInterval: 'MONTHLY',
    });

    expect(session.checkoutUrl).toContain('stripe.com');
    expect(session.checkoutUrl).toContain('199');
  });

  it('should return billing invoice history', async () => {
    const invoices = await service.getInvoices('ws-1');

    expect(invoices.length).toBeGreaterThan(0);
    expect(invoices[0].status).toBe('PAID');
  });
});
