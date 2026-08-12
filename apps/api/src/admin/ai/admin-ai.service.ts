import { Injectable, NotFoundException } from '@nestjs/common';

export interface AdminAiMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalTokensUsed: number;
  estimatedCostUSD: number;
  avgLatencyMs: number;
  featureBreakdown: Array<{ feature: string; requestCount: number; tokensUsed: number }>;
  providerCosts: Array<{ provider: string; costUSD: number; tokenCount: number }>;
}

export interface AdminAiProvider {
  id: string;
  name: string;
  defaultModel: string;
  enabled: boolean;
  isDefault: boolean;
  costPer1kTokensUSD: number;
  rateLimitRPM: number;
  maskedApiKey: string;
}

@Injectable()
export class AdminAiService {
  private providers: AdminAiProvider[] = [
    {
      id: 'openai',
      name: 'OpenAI (GPT-4o / GPT-4o-mini)',
      defaultModel: 'gpt-4o-mini',
      enabled: true,
      isDefault: true,
      costPer1kTokensUSD: 0.00015,
      rateLimitRPM: 10000,
      maskedApiKey: '••••••••8f2a',
    },
    {
      id: 'gemini',
      name: 'Google Gemini 1.5 Flash / Pro',
      defaultModel: 'gemini-1.5-flash',
      enabled: true,
      isDefault: false,
      costPer1kTokensUSD: 0.000075,
      rateLimitRPM: 15000,
      maskedApiKey: '••••••••4k91',
    },
    {
      id: 'anthropic',
      name: 'Anthropic Claude 3.5 Sonnet',
      defaultModel: 'claude-3-5-sonnet',
      enabled: true,
      isDefault: false,
      costPer1kTokensUSD: 0.003,
      rateLimitRPM: 5000,
      maskedApiKey: '••••••••77x9',
    },
  ];

  async getAiOverview(): Promise<AdminAiMetrics> {
    return {
      totalRequests: 48920,
      successfulRequests: 48400,
      failedRequests: 520,
      totalTokensUsed: 3845000,
      estimatedCostUSD: 1686.4,
      avgLatencyMs: 420,
      featureBreakdown: [
        { feature: 'Caption Generation', requestCount: 22400, tokensUsed: 1800000 },
        { feature: 'Content Rewriting', requestCount: 12100, tokensUsed: 950000 },
        { feature: 'Hashtag Recommendation', requestCount: 8400, tokensUsed: 420000 },
        { feature: 'Video Transcript Analysis', requestCount: 3900, tokensUsed: 520000 },
        { feature: 'Multi-Language Translation', requestCount: 2120, tokensUsed: 155000 },
      ],
      providerCosts: [
        { provider: 'OpenAI', costUSD: 1248.0, tokenCount: 2450000 },
        { provider: 'Google Gemini', costUSD: 438.4, tokenCount: 1395000 },
      ],
    };
  }

  async listProviders(): Promise<AdminAiProvider[]> {
    return this.providers;
  }

  async updateProvider(id: string, update: Partial<AdminAiProvider>): Promise<AdminAiProvider> {
    const p = this.providers.find((item) => item.id === id);
    if (!p) {
      throw new NotFoundException(`AI Provider ${id} not found`);
    }
    Object.assign(p, update);
    return p;
  }
}
