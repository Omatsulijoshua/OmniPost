import { Test, TestingModule } from '@nestjs/testing';
import { AdminPlatformsService } from './admin-platforms.service';

describe('AdminPlatformsService', () => {
  let service: AdminPlatformsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminPlatformsService],
    }).compile();

    service = module.get<AdminPlatformsService>(AdminPlatformsService);
  });

  it('should return overview telemetry across all social platforms including Snapchat', async () => {
    const platforms = await service.getPlatformsOverview();

    expect(platforms.length).toBeGreaterThan(0);
    expect(platforms.find((p) => p.slug === 'snapchat')).toBeDefined();
    expect(platforms.find((p) => p.slug === 'instagram')).toBeDefined();
  });

  it('should register custom social platform without code modification', async () => {
    const custom = await service.registerCustomPlatform({
      name: 'Mastodon',
      slug: 'mastodon',
    });

    expect(custom.name).toBe('Mastodon');
    expect(custom.isCustomPlatform).toBe(true);
  });

  it('should toggle platform maintenance status', async () => {
    const platform = await service.togglePlatformMaintenance('plat-instagram', true);
    expect(platform.status).toBe('MAINTENANCE');
  });

  it('should return cross-platform capability matrix', async () => {
    const matrix = await service.getCapabilityMatrix();
    expect(matrix.length).toBeGreaterThan(0);
    expect(matrix[0].storyPost).toBeDefined();
  });
});
