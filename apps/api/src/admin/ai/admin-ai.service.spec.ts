import { Test, TestingModule } from '@nestjs/testing';
import { AdminAiService } from './admin-ai.service';

describe('AdminAiService', () => {
  let service: AdminAiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminAiService],
    }).compile();

    service = module.get<AdminAiService>(AdminAiService);
  });

  it('should return AI token usage and cost metrics overview', async () => {
    const overview = await service.getAiOverview();

    expect(overview.totalRequests).toBeGreaterThan(0);
    expect(overview.totalTokensUsed).toBeGreaterThan(0);
  });

  it('should list LLM providers with multi-key pools', async () => {
    const providers = await service.listProviders();

    expect(providers.length).toBeGreaterThan(0);
    expect(providers.find((p) => p.id === 'groq')).toBeDefined();
    expect(providers[0].keyPool.length).toBeGreaterThan(0);
  });

  it('should parse comma-separated API keys into key pool', async () => {
    const updated = await service.updateProviderKeys('groq', 'gsk_key1, gsk_key2, gsk_key3', 'ROUND_ROBIN');

    expect(updated.keyPool.length).toBe(3);
    expect(updated.rotationStrategy).toBe('ROUND_ROBIN');
  });

  it('should execute test key rotation on rate limit failover', async () => {
    const rot = await service.testFailoverRotation('groq');

    expect(rot.success).toBe(true);
    expect(rot.rotatedAt).toBeDefined();
  });
});
