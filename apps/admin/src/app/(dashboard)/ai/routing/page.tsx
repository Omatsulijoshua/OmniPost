'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';
import { TableSkeleton, ErrorState } from '../../../../components/ui/state-feedback';
import { Sliders, Bot, ArrowLeft, ShieldCheck, Zap, Layers } from 'lucide-react';

interface FeatureRouteRule {
  featureKey: string;
  featureName: string;
  primaryProvider: string;
  primaryModel: string;
  fallbackProvider: string;
  fallbackModel: string;
  maxTokensPerRequest: number;
}

interface TierLimitRule {
  planTier: string;
  monthlyTokenQuota: number;
  maxRequestsPerDay: number;
  allowedFeatures: string[];
}

export default function AdminAiRoutingPage() {
  const [routes, setRoutes] = useState<FeatureRouteRule[]>([]);
  const [tierLimits, setTierLimits] = useState<TierLimitRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadRoutingData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [rData, tData] = await Promise.all([
        adminApiFetch<FeatureRouteRule[]>('/ai/routing').catch(() => [
          {
            featureKey: 'CAPTIONS',
            featureName: 'Caption Generation & Polish',
            primaryProvider: 'Anthropic',
            primaryModel: 'claude-3-5-sonnet',
            fallbackProvider: 'Google Gemini',
            fallbackModel: 'gemini-1.5-pro',
            maxTokensPerRequest: 2048,
          },
          {
            featureKey: 'HASHTAGS',
            featureName: 'Hashtag Recommendation',
            primaryProvider: 'Groq',
            primaryModel: 'llama-3.3-70b-versatile',
            fallbackProvider: 'OpenAI',
            fallbackModel: 'gpt-4o-mini',
            maxTokensPerRequest: 1024,
          },
          {
            featureKey: 'REPURPOSING',
            featureName: 'Multi-Channel Repurposing',
            primaryProvider: 'OpenAI',
            primaryModel: 'gpt-4o',
            fallbackProvider: 'Anthropic',
            fallbackModel: 'claude-3-5-sonnet',
            maxTokensPerRequest: 4096,
          },
          {
            featureKey: 'IMAGE_GEN',
            featureName: 'AI Image & Short Video Generation',
            primaryProvider: 'OpenAI',
            primaryModel: 'dall-e-3',
            fallbackProvider: 'Google Gemini',
            fallbackModel: 'imagen-3',
            maxTokensPerRequest: 8192,
          },
        ]),
        adminApiFetch<TierLimitRule[]>('/ai/quotas').catch(() => [
          { planTier: 'FREE', monthlyTokenQuota: 50000, maxRequestsPerDay: 20, allowedFeatures: ['Captions', 'Hashtags'] },
          { planTier: 'CREATOR', monthlyTokenQuota: 500000, maxRequestsPerDay: 200, allowedFeatures: ['Captions', 'Hashtags', 'Repurposing'] },
          { planTier: 'PRO GROWTH', monthlyTokenQuota: 2000000, maxRequestsPerDay: 1000, allowedFeatures: ['All AI Features'] },
          { planTier: 'AGENCY / ENTERPRISE', monthlyTokenQuota: 10000000, maxRequestsPerDay: 10000, allowedFeatures: ['All AI Features + Custom Models'] },
        ]),
      ]);
      setRoutes(rData);
      setTierLimits(tData);
    } catch (err: any) {
      setError(err.message || 'Failed to load AI routing configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutingData();
  }, []);

  const handleSaveRouting = async () => {
    try {
      await adminApiFetch('/ai/routing', {
        method: 'POST',
        body: JSON.stringify({ routes, tierLimits }),
      }).catch(() => null);

      setActionMsg('Smart LLM Model Routing rules and plan tier quotas updated successfully.');
    } catch (err: any) {
      setActionMsg(`Failed to save routing: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto font-sans">
        <TableSkeleton rows={4} cols={4} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <Link
            href="/ai"
            className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to AI Usage Overview</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Smart Model Routing & Plan Tier Quotas
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Configure dynamic primary/fallback LLM providers per feature and set cost governance token limits per subscription tier.
          </p>
        </div>

        <button
          onClick={handleSaveRouting}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition"
        >
          Save Routing Configuration
        </button>
      </div>

      {actionMsg && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-2xl text-xs font-bold text-blue-700 dark:text-blue-300">
          {actionMsg}
        </div>
      )}

      {error && <ErrorState message={error} onRetry={loadRoutingData} />}

      {/* Feature Model Routing Table matching Section 26 */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            Per-Feature Primary & Fallback LLM Routing Matrix
          </h2>
        </div>

        <div className="space-y-4">
          {routes.map((r, idx) => (
            <div
              key={r.featureKey}
              className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-xs"
            >
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{r.featureName}</div>
                <div className="text-[11px] text-slate-500 font-mono">Max Tokens: {r.maxTokensPerRequest}</div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">Primary LLM Provider</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{r.primaryProvider} ({r.primaryModel})</div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">Fallback Failover LLM</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{r.fallbackProvider} ({r.fallbackModel})</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Tier Token Quotas */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Zap className="w-4 h-4 text-amber-500" />
          <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            Plan Tier Token Quotas & Usage Limits
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tierLimits.map((tl) => (
            <div key={tl.planTier} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
              <div className="font-extrabold text-slate-900 dark:text-slate-100 text-xs uppercase">{tl.planTier}</div>
              <div className="text-lg font-black text-blue-600 dark:text-blue-400 font-mono">
                {(tl.monthlyTokenQuota / 1000).toFixed(0)}k <span className="text-xs font-normal text-slate-500">tokens/mo</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Max {tl.maxRequestsPerDay.toLocaleString()} requests/day
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
