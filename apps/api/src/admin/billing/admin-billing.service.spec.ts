import { Test, TestingModule } from '@nestjs/testing';
import { AdminBillingService } from './admin-billing.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AdminBillingService', () => {
  let service: AdminBillingService;

  const mockPrismaService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminBillingService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AdminBillingService>(AdminBillingService);
  });

  it('should return MRR and ARR revenue overview', async () => {
    const rev = await service.getRevenueOverview();

    expect(rev.mrrUSD).toBeGreaterThan(0);
    expect(rev.arrUSD).toBeGreaterThan(0);
  });

  it('should list customer active & trial subscriptions', async () => {
    const subs = await service.listSubscriptions();

    expect(subs.length).toBeGreaterThan(0);
    expect(subs[0].planName).toBeDefined();
  });

  it('should list plan tiers with quotas', async () => {
    const plans = await service.listPlans();

    expect(plans.length).toBeGreaterThan(0);
    expect(plans.find((p) => p.name === 'Enterprise Agency')).toBeDefined();
  });

  it('should process payment refund with reason', async () => {
    const res = await service.refundPayment('tx-9001', 'Duplicate charge error');

    expect(res.status).toBe('REFUNDED');
    expect(res.reason).toBe('Duplicate charge error');
  });
});
