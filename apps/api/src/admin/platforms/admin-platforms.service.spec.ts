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

  it('should return health status for all 13 supported social platforms', async () => {
    const platforms = await service.listPlatforms();

    expect(platforms.length).toBe(13);
    expect(platforms.find((p) => p.id === 'instagram')).toBeDefined();
    expect(platforms.find((p) => p.id === 'tiktok')).toBeDefined();
  });

  it('should toggle maintenance mode on a platform', async () => {
    const res = await service.toggleMaintenance('instagram', true);

    expect(res.status).toBe('MAINTENANCE');
    expect(res.publishingStatus).toBe('DISABLED');
  });

  it('should return platform capability matrix', async () => {
    const matrix = await service.getCapabilityMatrix();

    expect(matrix.length).toBe(13);
    expect(matrix.find((m) => m.platform === 'Instagram')?.stories).toBe(true);
  });
});
