import { Test, TestingModule } from '@nestjs/testing';
import { AdminSettingsService } from './admin-settings.service';

describe('AdminSettingsService', () => {
  let service: AdminSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminSettingsService],
    }).compile();

    service = module.get<AdminSettingsService>(AdminSettingsService);
  });

  it('should list feature flags and update rollout percentage', async () => {
    const flags = await service.listFeatureFlags();
    expect(flags.length).toBeGreaterThan(0);

    const updated = await service.updateFeatureFlag('ai-video-reels-generator', { rolloutPercentage: 80 });
    expect(updated.rolloutPercentage).toBe(80);
  });

  it('should return and update global platform settings', async () => {
    const settings = await service.getPlatformSettings();
    expect(settings.systemName).toBeDefined();

    const updated = await service.updatePlatformSettings({ maintenanceMode: true });
    expect(updated.maintenanceMode).toBe(true);
  });

  it('should list RBAC permission matrix for all 7 administrative roles', async () => {
    const roles = await service.listRolePermissions();

    expect(roles.length).toBe(7);
    expect(roles.find((r) => r.role === 'SUPER_ADMIN')).toBeDefined();
  });
});
