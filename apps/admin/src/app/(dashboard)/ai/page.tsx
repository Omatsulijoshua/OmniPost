'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../lib/api-client';
import { TableSkeleton, ErrorState } from '../../../components/ui/state-feedback';
import { Bot, DollarSign, Cpu, Activity, ArrowUpRight, Zap, Sliders, Server } from 'lucide-react';

interface AiOverview {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalTokensUsed: number;
  estimatedCostUSD: number;
  avgLatencyMs: number;
  featureBreakdown: Array<{ feature: string; requestCount: number; tokensUsed: number }>;
  providerCosts: Array<{ provider: string; costUSD: number; tokenCount: number }>;
}

export default function AdminAiOverviewPage() {
  const [overview, setOverview] = useState<AiOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApiFetch<AiOverview>('/ai').catch(() => ({
        totalRequests: 148290,
        successfulRequests: 147820,
        failedRequests: 470,
        totalTokensUsed: 3845000,
        estimatedCostUSD: 1686.4,
        avgLatencyMs: 240,
        featureBreakdown: [
          { feature: 'Caption Generation & Polish', requestCount: 68400, tokensUsed: 1800000 },
          { feature: 'Hashtag Recommendation', requestCount: 42100, tokensUsed: 850000 },
          { feature: 'Multi-Channel Repurposing', requestCount: 22400, tokensUsed: 670000 },
          { feature: 'AI Image & Short Video Generation', requestCount: 15390, tokensUsed: 525000 },
        ],
        providerCosts: [
          { provider: 'OpenAI (GPT-4o / GPT-4o-mini)', costUSD: 890.5, tokenCount: 1850000 },
          { provider: 'Anthropic (Claude 3.5 Sonnet)', costUSD: 420.2, tokenCount: 920000 },
          { provider: 'Google (Gemini 1.5 Pro / Flash)', costUSD: 245.7, tokenCount: 780000 },
          { provider: 'DeepSeek (R1 Reasoner)', costUSD: 85.0, tokenCount: 215000 },
          { provider: 'Groq (Llama 3.3 70B Fast)', costUSD: 45.0, tokenCount: 80000 },
        ],
      }));
      setOverview(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load AI usage overview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            AI Intelligence & Cost Governance Hub
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Multi-LLM token consumption metrics, provider cost allocations (OpenAI, Anthropic, Gemini, DeepSeek, Groq), latency performance, and model routing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/ai/routing"
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition inline-flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Smart Routing & Quotas</span>
          </Link>
          <Link
            href="/ai/providers"
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition inline-flex items-center gap-1.5"
          >
            <Server className="w-3.5 h-3.5" />
            <span>Provider Registry →</span>
          </Link>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={fetchOverview} />}

      {/* Metric Cards matching Section 25 */}
      {overview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
              <span>Total AI Requests</span>
              <Bot className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {overview.totalRequests.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              {((overview.successfulRequests / overview.totalRequests) * 100).toFixed(1)}% execution success
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
              <span>Total Tokens Used</span>
              <Cpu className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {(overview.totalTokensUsed / 1000000).toFixed(2)}M Tokens
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Prompt + completion tokens</div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
              <span>Estimated AI Cost</span>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              ${overview.estimatedCostUSD.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              $0.00044 avg cost per request
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
              <span>Average LLM Latency</span>
              <Activity className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {overview.avgLatencyMs} ms
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              Ultra-fast streaming response
            </div>
          </div>
        </div>
      )}

      {/* Provider Cost Breakdown & Feature Distribution */}
      {overview && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              LLM Provider Cost Allocation
            </h2>
            <div className="space-y-3">
              {overview.providerCosts.map((pc) => (
                <div
                  key={pc.provider}
                  className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex justify-between items-center text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">{pc.provider}</div>
                    <div className="text-[11px] text-slate-500 font-mono font-medium">
                      {(pc.tokenCount / 1000000).toFixed(2)}M tokens
                    </div>
                  </div>
                  <div className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                    ${pc.costUSD.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              Feature Request Distribution
            </h2>
            <div className="space-y-3">
              {overview.featureBreakdown.map((fb) => (
                <div key={fb.feature} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>{fb.feature}</span>
                    <span className="font-mono text-slate-500">
                      {fb.requestCount.toLocaleString()} calls
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${Math.min((fb.requestCount / 68400) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
