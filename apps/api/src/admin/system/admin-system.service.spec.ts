import { Test, TestingModule } from '@nestjs/testing';
import { AdminSystemService } from './admin-system.service';

describe('AdminSystemService', () => {
  let service: AdminSystemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminSystemService],
    }).compile();

    service = module.get<AdminSystemService>(AdminSystemService);
  });

  it('should return infrastructure health overview status', async () => {
    const health = await service.getHealthOverview();

    expect(health.length).toBeGreaterThan(0);
    expect(health[0].status).toBe('OPERATIONAL');
  });

  it('should list BullMQ queue states and support pause/resume toggle', async () => {
    const queues = await service.listQueues();
    expect(queues.length).toBeGreaterThan(0);

    const paused = await service.toggleQueuePause('social-publishing-queue', true);
    expect(paused.isPaused).toBe(true);
  });

  it('should list active worker fleet CPU and memory telemetry', async () => {
    const fleet = await service.listWorkerFleet();

    expect(fleet.length).toBeGreaterThan(0);
    expect(fleet[0].cpuPercent).toBeGreaterThan(0);
  });
});
