'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';

interface KeyPoolItem {
  keyHash: string;
  maskedKey: string;
  status: string;
  lastUsedAt: string;
  requestsHandled: number;
}

interface Provider {
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
  rotationStrategy: string;
}

export default function AdminAiRoutingPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [editingKeys, setEditingKeys] = useState<{ [id: string]: string }>({});
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadProviders = () => {
    adminApiFetch<Provider[]>('/ai/providers')
      .then((data) => {
        setProviders(data);
        const initialInputs: { [id: string]: string } = {};
        data.forEach((p) => {
          initialInputs[p.id] = p.rawApiKeysInput || '';
        });
        setEditingKeys(initialInputs);
      })
      .catch(() => {
        const dummy: Provider[] = [
          { id: 'groq', name: 'Groq Cloud (Llama 3.3 70B / Mixtral)', defaultModel: 'llama-3.3-70b-versatile', enabled: true, isDefault: true, costPer1kTokensUSD: 0, rateLimitRPM: 30000, rawApiKeysInput: 'gsk_free_key_alpha_129, gsk_free_key_beta_384', keyPool: [{ keyHash: '1', maskedKey: 'gsk_••••a129', status: 'ACTIVE', lastUsedAt: new Date().toISOString(), requestsHandled: 1240 }, { keyHash: '2', maskedKey: 'gsk_••••b384', status: 'ACTIVE', lastUsedAt: new Date().toISOString(), requestsHandled: 980 }], activeKeyIndex: 0, rotationStrategy: 'ROUND_ROBIN' },
          { id: 'gemini', name: 'Google Gemini 1.5 Flash / Pro', defaultModel: 'gemini-1.5-flash', enabled: true, isDefault: false, costPer1kTokensUSD: 0, rateLimitRPM: 15000, rawApiKeysInput: 'AIzaSy_free_gemini_k1, AIzaSy_free_gemini_k2', keyPool: [{ keyHash: '1', maskedKey: 'AIza••••gem1', status: 'ACTIVE', lastUsedAt: new Date().toISOString(), requestsHandled: 2100 }, { keyHash: '2', maskedKey: 'AIza••••gem2', status: 'ACTIVE', lastUsedAt: new Date().toISOString(), requestsHandled: 1850 }], activeKeyIndex: 0, rotationStrategy: 'ROUND_ROBIN' },
        ];
        setProviders(dummy);
      });
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const handleSaveKeys = async (id: string) => {
    const rawKeys = editingKeys[id] || '';
    try {
      await adminApiFetch(`/ai/providers/${id}/keys`, {
        method: 'POST',
        body: JSON.stringify({ keys: rawKeys, strategy: 'ROUND_ROBIN' }),
      });
      setActionMsg(`API key pool updated for provider "${id}".`);
      loadProviders();
    } catch (err: any) {
      setActionMsg(`Failed to update keys: ${err.message}`);
    }
  };

  const handleTestFailover = async (id: string) => {
    try {
      const res = await adminApiFetch<{ newActiveKey: string }>(`/ai/providers/${id}/test-failover`, {
        method: 'POST',
      });
      setActionMsg(`Simulated 429 quota exhaustion on "${id}". Rotated to active key: ${res.newActiveKey}`);
      loadProviders();
    } catch (err: any) {
      setActionMsg(`Failover test failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <Link href="/ai" className="text-xs font-semibold text-indigo-400 hover:underline">
          ← Back to AI Usage Overview
        </Link>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight mt-1">Multi-Key AI Routing & Failover Studio</h1>
        <p className="mt-1 text-sm text-slate-400">
          Combine multiple API keys per provider (comma-separated), maximize free-tier API quotas (Groq, Gemini), and configure automatic Round-Robin rate limit failover.
        </p>
      </div>

      {actionMsg && (
        <div className="p-4 bg-indigo-950/60 border border-indigo-800/60 rounded-xl text-xs text-indigo-300 font-mono">
          {actionMsg}
        </div>
      )}

      <div className="space-y-6">
        {providers.map((p) => (
          <div key={p.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-100">{p.name}</h2>
                  <span className="px-2 py-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 rounded-full">
                    {p.keyPool.length} Keys in Pool
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Model: {p.defaultModel} • Strategy: {p.rotationStrategy} • Rate Limit: {p.rateLimitRPM.toLocaleString()} RPM
                </p>
              </div>

              <button
                onClick={() => handleTestFailover(p.id)}
                className="px-3.5 py-2 bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-300 font-bold text-xs rounded-xl transition"
              >
                ⚡ Test Failover Rotation
              </button>
            </div>

            {/* Active Keys Health Pills */}
            <div className="flex flex-wrap gap-2">
              {p.keyPool.map((k, i) => (
                <div
                  key={i}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-2 ${
                    p.activeKeyIndex === i
                      ? 'bg-indigo-950 border-indigo-700 text-indigo-300 font-bold'
                      : k.status === 'RATE_LIMITED'
                      ? 'bg-rose-950 border-rose-800 text-rose-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${p.activeKeyIndex === i ? 'bg-indigo-400 animate-pulse' : k.status === 'RATE_LIMITED' ? 'bg-rose-500' : 'bg-slate-500'}`} />
                  <span>{k.maskedKey}</span>
                  {p.activeKeyIndex === i && <span className="text-[9px] bg-indigo-900 text-indigo-200 px-1.5 py-0.2 rounded font-sans">ACTIVE</span>}
                </div>
              ))}
            </div>

            {/* Comma-Separated Key Input Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Comma-Separated API Keys Pool Input:</label>
              <textarea
                value={editingKeys[p.id] || ''}
                onChange={(e) => setEditingKeys({ ...editingKeys, [p.id]: e.target.value })}
                placeholder="Paste keys separated by commas: key_1, key_2, key_3..."
                className="w-full h-20 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => handleSaveKeys(p.id)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg transition"
                >
                  Save Key Pool
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
