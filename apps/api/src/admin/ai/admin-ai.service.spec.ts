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
    expect(overview.estimatedCostUSD).toBeGreaterThan(0);
  });

  it('should list LLM providers with masked API keys', async () => {
    const providers = await service.listProviders();

    expect(providers.length).toBeGreaterThan(0);
    expect(providers[0].maskedApiKey).toContain('••••••••');
  });
});
