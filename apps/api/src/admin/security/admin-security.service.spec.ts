import { Test, TestingModule } from '@nestjs/testing';
import { AdminSecurityService } from './admin-security.service';

describe('AdminSecurityService', () => {
  let service: AdminSecurityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminSecurityService],
    }).compile();

    service = module.get<AdminSecurityService>(AdminSecurityService);
  });

  it('should return and update security access policies', async () => {
    const policies = await service.getPolicies();
    expect(policies.sessionInactivityTimeoutMinutes).toBe(30);

    const updated = await service.updatePolicies({ sessionInactivityTimeoutMinutes: 15 });
    expect(updated.sessionInactivityTimeoutMinutes).toBe(15);
  });

  it('should list active admin sessions and support session revocation', async () => {
    const sessions = await service.listActiveSessions();
    expect(sessions.length).toBeGreaterThan(0);

    const res = await service.revokeSession('sess-901');
    expect(res.success).toBe(true);
  });

  it('should return security threat telemetry metrics', async () => {
    const telemetry = await service.getThreatTelemetry();
    expect(telemetry.bruteForceBlocks24h).toBeGreaterThan(0);
  });
});
