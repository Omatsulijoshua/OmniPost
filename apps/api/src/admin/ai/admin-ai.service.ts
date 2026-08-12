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

export interface KeyPoolItem {
  keyHash: string;
  maskedKey: string;
  status: 'ACTIVE' | 'RATE_LIMITED' | 'EXHAUSTED';
  lastUsedAt: string;
  requestsHandled: number;
}

export interface AdminAiProvider {
  id: string;
  name: string;
  defaultModel: string;
  enabled: boolean;
  isDefault: boolean;
  costPer1kTokensUSD: number;
  rateLimitRPM: number;
  rawApiKeysInput: string;
  keyPool: KeyPoolItem[];
  activeKeyIndex: number;
  rotationStrategy: 'ROUND_ROBIN' | 'FAILOVER_ON_LIMIT';
}

@Injectable()
export class AdminAiService {
  private providers: AdminAiProvider[] = [
    {
      id: 'groq',
      name: 'Groq Cloud (Llama 3.3 70B / Mixtral)',
      defaultModel: 'llama-3.3-70b-versatile',
      enabled: true,
      isDefault: true,
      costPer1kTokensUSD: 0.0,
      rateLimitRPM: 30000,
      rawApiKeysInput: 'gsk_free_key_alpha_129, gsk_free_key_beta_384',
      keyPool: [
        { keyHash: 'gsk_129', maskedKey: 'gsk_••••a129', status: 'ACTIVE', lastUsedAt: new Date().toISOString(), requestsHandled: 1240 },
        { keyHash: 'gsk_384', maskedKey: 'gsk_••••b384', status: 'ACTIVE', lastUsedAt: new Date(Date.now() - 60000).toISOString(), requestsHandled: 980 },
      ],
      activeKeyIndex: 0,
      rotationStrategy: 'ROUND_ROBIN',
    },
    {
      id: 'gemini',
      name: 'Google Gemini 1.5 Flash / Pro',
      defaultModel: 'gemini-1.5-flash',
      enabled: true,
      isDefault: false,
      costPer1kTokensUSD: 0.0,
      rateLimitRPM: 15000,
      rawApiKeysInput: 'AIzaSy_free_gemini_k1, AIzaSy_free_gemini_k2',
      keyPool: [
        { keyHash: 'AIza_k1', maskedKey: 'AIza••••gem1', status: 'ACTIVE', lastUsedAt: new Date().toISOString(), requestsHandled: 2100 },
        { keyHash: 'AIza_k2', maskedKey: 'AIza••••gem2', status: 'ACTIVE', lastUsedAt: new Date(Date.now() - 120000).toISOString(), requestsHandled: 1850 },
      ],
      activeKeyIndex: 0,
      rotationStrategy: 'ROUND_ROBIN',
    },
    {
      id: 'openai',
      name: 'OpenAI (GPT-4o / GPT-4o-mini)',
      defaultModel: 'gpt-4o-mini',
      enabled: true,
      isDefault: false,
      costPer1kTokensUSD: 0.00015,
      rateLimitRPM: 10000,
      rawApiKeysInput: 'sk-proj-key1, sk-proj-key2',
      keyPool: [
        { keyHash: 'sk_k1', maskedKey: 'sk-proj-••••key1', status: 'ACTIVE', lastUsedAt: new Date().toISOString(), requestsHandled: 5400 },
      ],
      activeKeyIndex: 0,
      rotationStrategy: 'FAILOVER_ON_LIMIT',
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
      ],
      providerCosts: [
        { provider: 'Groq Cloud (Free Tier Pool)', costUSD: 0.0, tokenCount: 2850000 },
        { provider: 'Google Gemini (Free Tier Pool)', costUSD: 0.0, tokenCount: 995000 },
        { provider: 'OpenAI', costUSD: 1686.4, tokenCount: 2450000 },
      ],
    };
  }

  async listProviders(): Promise<AdminAiProvider[]> {
    return this.providers;
  }

  async updateProviderKeys(id: string, rawKeysInput: string, strategy?: 'ROUND_ROBIN' | 'FAILOVER_ON_LIMIT'): Promise<AdminAiProvider> {
    const p = this.providers.find((item) => item.id === id);
    if (!p) throw new NotFoundException(`AI Provider ${id} not found`);

    const splitKeys = rawKeysInput.split(',').map((k) => k.trim()).filter((k) => k.length > 0);
    p.rawApiKeysInput = rawKeysInput;
    if (strategy) p.rotationStrategy = strategy;

    p.keyPool = splitKeys.map((k, i) => ({
      keyHash: `key-${i}-${k.substring(0, 6)}`,
      maskedKey: k.length > 8 ? `${k.substring(0, 4)}••••${k.substring(k.length - 4)}` : '••••••••',
      status: 'ACTIVE',
      lastUsedAt: new Date().toISOString(),
      requestsHandled: 0,
    }));
    p.activeKeyIndex = 0;
    return p;
  }

  async testFailoverRotation(id: string) {
    const p = this.providers.find((item) => item.id === id);
    if (!p) throw new NotFoundException(`AI Provider ${id} not found`);

    if (p.keyPool.length > 0) {
      p.keyPool[p.activeKeyIndex].status = 'RATE_LIMITED';
      p.activeKeyIndex = (p.activeKeyIndex + 1) % p.keyPool.length;
    }

    return {
      success: true,
      providerId: id,
      newActiveKey: p.keyPool[p.activeKeyIndex]?.maskedKey || 'None Available',
      activeKeyIndex: p.activeKeyIndex,
      totalKeysInPool: p.keyPool.length,
      rotatedAt: new Date().toISOString(),
    };
  }
}
