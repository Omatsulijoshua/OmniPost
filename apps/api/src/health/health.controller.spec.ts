import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('should return health status ok', () => {
    const controller = new HealthController();
    const result = controller.checkHealth();
    expect(result.success).toBe(true);
    expect(result.data?.status).toBe('ok');
  });
});
