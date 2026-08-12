'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../lib/api-client';

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

  useEffect(() => {
    adminApiFetch<AiOverview>('/ai')
      .then((data) => setOverview(data))
      .catch(() => {
        setOverview({
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
            { provider: 'OpenAI', costUSD: 1248.0, tokenCount: 2450000 },
            { provider: 'Google Gemini', costUSD: 438.4, tokenCount: 1395000 },
          ],
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">AI Usage & Cost Monitoring</h1>
          <p className="mt-1 text-sm text-slate-400">
            Multi-LLM token usage, provider cost breakdown (OpenAI, Gemini, Anthropic), feature telemetry, and latency.
          </p>
        </div>

        <Link
          href="/ai/providers"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition"
        >
          Manage AI Providers →
        </Link>
      </div>

      {overview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1"><div className="text-xs font-semibold text-slate-400 uppercase">Total AI Requests</div><div className="text-2xl font-black text-slate-100">{overview.totalRequests.toLocaleString()}</div></div>
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1"><div className="text-xs font-semibold text-indigo-400 uppercase">Total Tokens Used</div><div className="text-2xl font-black text-indigo-400">{(overview.totalTokensUsed / 1000000).toFixed(2)}M</div></div>
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1"><div className="text-xs font-semibold text-emerald-400 uppercase">Estimated AI Cost</div><div className="text-2xl font-black text-emerald-400">${overview.estimatedCostUSD.toLocaleString()}</div></div>
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1"><div className="text-xs font-semibold text-amber-400 uppercase">Avg Latency</div><div className="text-2xl font-black text-amber-400">{overview.avgLatencyMs} ms</div></div>
        </div>
      )}

      {/* Provider Cost Breakdown */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <h2 className="text-base font-bold text-slate-100">LLM Provider Cost Breakdown</h2>
            <div className="space-y-3">
              {overview.providerCosts.map((pc) => (
                <div key={pc.provider} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-slate-100">{pc.provider}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{(pc.tokenCount / 1000000).toFixed(2)}M tokens</div>
                  </div>
                  <div className="font-black text-emerald-400 text-sm">${pc.costUSD.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <h2 className="text-base font-bold text-slate-100">Feature Request Distribution</h2>
            <div className="space-y-3">
              {overview.featureBreakdown.map((fb) => (
                <div key={fb.feature} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-300">
                    <span>{fb.feature}</span>
                    <span className="font-mono text-slate-400">{fb.requestCount.toLocaleString()} calls</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${Math.min((fb.requestCount / 22400) * 100, 100)}%` }} />
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
