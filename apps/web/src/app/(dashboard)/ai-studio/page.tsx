'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../../lib/auth-store';
import { apiFetch } from '../../../lib/api-client';
import {
  AICaptionAdaptResult,
  ContentAuditResult,
  PlatformType,
  ToneOption,
} from '@omnipost/types';
import { Button } from '@omnipost/ui';

const tones: ToneOption[] = [
  'Professional',
  'Viral',
  'Casual',
  'Sales',
  'Storytelling',
  'Educational',
  'Humor',
];

const platforms: PlatformType[] = [
  'INSTAGRAM',
  'TIKTOK',
  'YOUTUBE',
  'X',
  'LINKEDIN',
  'FACEBOOK',
  'THREADS',
  'QUORA',
  'REDDIT',
  'BLUESKY',
  'PINTEREST',
  'TELEGRAM',
  'DISCORD',
  'OTHER',
];

export default function AIStudioPage() {
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);

  const [inputCaption, setInputCaption] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('INSTAGRAM');
  const [selectedTone, setSelectedTone] = useState<ToneOption>('Viral');

  const [adaptResult, setAdaptResult] = useState<AICaptionAdaptResult | null>(null);
  const [auditResult, setAuditResult] = useState<ContentAuditResult | null>(null);

  const [sourceText, setSourceText] = useState('');
  const [repurposedPosts, setRepurposedPosts] = useState<Record<string, string> | null>(null);

  const [imageConcept, setImageConcept] = useState('');
  const [imagePrompt, setImagePrompt] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdapt = async () => {
    if (!inputCaption) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<AICaptionAdaptResult>('/ai/adapt-caption', {
        method: 'POST',
        body: JSON.stringify({
          caption: inputCaption,
          platformType: selectedPlatform,
          tone: selectedTone,
        }),
      });
      setAdaptResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to adapt caption');
    } finally {
      setLoading(false);
    }
  };

  const handleAudit = async () => {
    if (!inputCaption) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<ContentAuditResult>('/ai/score-content', {
        method: 'POST',
        body: JSON.stringify({
          caption: inputCaption,
          platformType: selectedPlatform,
        }),
      });
      setAuditResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to score content');
    } finally {
      setLoading(false);
    }
  };

  const handleRepurpose = async () => {
    if (!sourceText) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<Record<string, string>>('/ai/repurpose', {
        method: 'POST',
        body: JSON.stringify({
          sourceText,
          targetPlatforms: ['X', 'LINKEDIN', 'INSTAGRAM'],
        }),
      });
      setRepurposedPosts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to repurpose text');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePrompt = async () => {
    if (!imageConcept) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<{ prompt: string }>('/ai/generate-image-prompt', {
        method: 'POST',
        body: JSON.stringify({ concept: imageConcept }),
      });
      setImagePrompt(data.prompt);
    } catch (err: any) {
      setError(err.message || 'Failed to generate image prompt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">AI Studio</h1>
        <p className="mt-1 text-sm text-slate-400">
          Smart content adaptation, post quality scoring, and long-form repurposing for{' '}
          <span className="font-semibold text-indigo-400">{activeWorkspace?.name}</span>
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-800/60 rounded-xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Feature 1: Caption Adaptation & Content Scoring */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
        <h2 className="text-base font-bold text-slate-100">1. Caption Adapter & Quality Auditor</h2>

        <div className="space-y-4">
          <textarea
            rows={4}
            value={inputCaption}
            onChange={(e) => setInputCaption(e.target.value)}
            placeholder="Paste your raw content idea or universal caption here..."
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Target Platform</label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value as PlatformType)}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none"
                >
                  {platforms.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Desired Tone</label>
                <select
                  value={selectedTone}
                  onChange={(e) => setSelectedTone(e.target.value as ToneOption)}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none"
                >
                  {tones.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAdapt}
                disabled={loading || !inputCaption}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20"
              >
                ✨ Adapt with AI
              </button>
              <button
                onClick={handleAudit}
                disabled={loading || !inputCaption}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold rounded-xl"
              >
                📊 Score Content (0-100)
              </button>
            </div>
          </div>
        </div>

        {/* Adaptation Output */}
        {adaptResult && (
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-400 uppercase">
                Adapted for {adaptResult.platformType} ({adaptResult.tone})
              </span>
              <span className="text-slate-500">{adaptResult.hashtags.join(' ')}</span>
            </div>
            <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
              {adaptResult.adaptedCaption}
            </div>
          </div>
        )}

        {/* Content Audit Score Meter */}
        {auditResult && (
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Content Quality Audit</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-indigo-400">{auditResult.score} / 100</span>
                <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 rounded-full">
                  {auditResult.rating}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-[11px] font-semibold text-emerald-400 uppercase mb-1">Strengths</div>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {auditResult.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-amber-400 uppercase mb-1">Improvements</div>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {auditResult.improvements.length > 0
                    ? auditResult.improvements.map((imp, i) => <li key={i}>{imp}</li>)
                    : <li>No major issues detected!</li>}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feature 2: Long-Form Content Repurposer */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-slate-100">2. Long-Form Content Repurposer</h2>
        <textarea
          rows={4}
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder="Paste a long blog article, newsletter, or transcript here to convert into multi-channel posts..."
          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
        />
        <button
          onClick={handleRepurpose}
          disabled={loading || !sourceText}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20"
        >
          ♻️ Repurpose into X, LinkedIn & Instagram Posts
        </button>

        {repurposedPosts && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {Object.entries(repurposedPosts).map(([plat, text]) => (
              <div key={plat} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="text-xs font-bold text-indigo-400 uppercase">{plat}</div>
                <div className="text-xs text-slate-300 whitespace-pre-wrap">{text}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feature 3: Image Prompt Generator */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-slate-100">3. AI Image Prompt Generator</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={imageConcept}
            onChange={(e) => setImageConcept(e.target.value)}
            placeholder="Describe your visual concept (e.g. A futuristic workspace with holographic analytics UI)..."
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleImagePrompt}
            disabled={loading || !imageConcept}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20"
          >
            🎨 Generate Prompt
          </button>
        </div>

        {imagePrompt && (
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200">
            <span className="font-bold text-indigo-400 block mb-1">Generated Image Prompt:</span>
            {imagePrompt}
          </div>
        )}
      </div>
    </div>
  );
}
