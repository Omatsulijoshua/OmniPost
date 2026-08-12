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
  rawApiKeysInput: string;
}

export default function AdminAiProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    adminApiFetch<Provider[]>('/ai/providers')
      .then((data) => setProviders(data))
      .catch(() => {
        setProviders([
          { id: 'groq', name: 'Groq Cloud (Llama 3.3 70B / Mixtral)', defaultModel: 'llama-3.3-70b-versatile', enabled: true, isDefault: true, costPer1kTokensUSD: 0, rateLimitRPM: 30000, rawApiKeysInput: 'gsk_free_key_alpha_129, gsk_free_key_beta_384' },
          { id: 'gemini', name: 'Google Gemini 1.5 Flash / Pro', defaultModel: 'gemini-1.5-flash', enabled: true, isDefault: false, costPer1kTokensUSD: 0, rateLimitRPM: 15000, rawApiKeysInput: 'AIzaSy_free_gemini_k1, AIzaSy_free_gemini_k2' },
        ]);
      });
  }, []);

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <Link href="/ai" className="text-xs font-semibold text-indigo-400 hover:underline">
            ← Back to AI Usage Overview
          </Link>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight mt-1">LLM Provider & Model Management</h1>
          <p className="mt-1 text-sm text-slate-400">
            Configure multi-provider LLM models, cost rates, rate limits, and multi-key rotation pools.
          </p>
        </div>

        <Link
          href="/ai/routing"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition"
        >
          ⚡ Multi-Key Router Studio →
        </Link>
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
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/ai/routing"
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl transition"
              >
                Manage Key Pool →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
