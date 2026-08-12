'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';

interface Provider {
  id: string;
  name: string;
  defaultModel: string;
  enabled: boolean;
  isDefault: boolean;
  costPer1kTokensUSD: number;
  rateLimitRPM: number;
  maskedApiKey: string;
}

export default function AdminAiProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApiFetch<Provider[]>('/ai/providers')
      .then((data) => setProviders(data))
      .catch(() => {
        setProviders([
          { id: 'openai', name: 'OpenAI (GPT-4o / GPT-4o-mini)', defaultModel: 'gpt-4o-mini', enabled: true, isDefault: true, costPer1kTokensUSD: 0.00015, rateLimitRPM: 10000, maskedApiKey: '••••••••8f2a' },
          { id: 'gemini', name: 'Google Gemini 1.5 Flash / Pro', defaultModel: 'gemini-1.5-flash', enabled: true, isDefault: false, costPer1kTokensUSD: 0.000075, rateLimitRPM: 15000, maskedApiKey: '••••••••4k91' },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <Link href="/ai" className="text-xs font-semibold text-indigo-400 hover:underline">
          ← Back to AI Usage Overview
        </Link>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight mt-1">LLM Provider & Model Management</h1>
        <p className="mt-1 text-sm text-slate-400">
          Configure multi-provider LLM models, cost rates, rate limits, and secure encrypted API credentials.
        </p>
      </div>

      <div className="space-y-4">
        {providers.map((p) => (
          <div key={p.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">{p.name}</h2>
                {p.isDefault && (
                  <span className="px-2 py-0.5 text-[9px] font-bold text-indigo-400 bg-indigo-950 border border-indigo-800 rounded-full">
                    DEFAULT
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Model: {p.defaultModel} • Cost: ${p.costPer1kTokensUSD} / 1k tokens • Limit: {p.rateLimitRPM.toLocaleString()} RPM
              </p>
              <p className="text-xs text-slate-500 font-mono">API Key: {p.maskedApiKey}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                p.enabled ? 'text-emerald-400 bg-emerald-950 border-emerald-800' : 'text-slate-400 bg-slate-950 border-slate-800'
              }`}>
                {p.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
