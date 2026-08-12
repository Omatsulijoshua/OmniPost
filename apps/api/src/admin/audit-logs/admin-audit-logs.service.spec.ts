import { Test, TestingModule } from '@nestjs/testing';
import { AdminAuditLogsService } from './admin-audit-logs.service';

describe('AdminAuditLogsService', () => {
  let service: AdminAuditLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminAuditLogsService],
    }).compile();

    service = module.get<AdminAuditLogsService>(AdminAuditLogsService);
  });

  it('should list security audit logs', async () => {
    const logs = await service.listAuditLogs();

    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].action).toBeDefined();
  });

  it('should return audit detail with SHA-256 cryptographic verification', async () => {
    const detail = await service.getAuditLogDetail('aud-7001');

    expect(detail.id).toBe('aud-7001');
    expect(detail.cryptographicHash).toBeDefined();
    expect(detail.isHashValid).toBe(true);
    expect(detail.beforeState).toBeDefined();
    expect(detail.afterState).toBeDefined();
  });
});
