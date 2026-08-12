'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../lib/auth-store';
import { apiFetch } from '../../../lib/api-client';
import { BrandKitDetail, ContentTemplateDetail } from '@omnipost/types';

export default function BrandKitPage() {
  const router = useRouter();
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);

  const [brandKit, setBrandKit] = useState<BrandKitDetail | null>(null);
  const [templates, setTemplates] = useState<ContentTemplateDetail[]>([]);

  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [secondaryColor, setSecondaryColor] = useState('#a855f7');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [logoUrl, setLogoUrl] = useState('');
  const [watermarkUrl, setWatermarkUrl] = useState('');
  const [defaultCta, setDefaultCta] = useState('');
  const [hashtagsText, setHashtagsText] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadBrandData = async () => {
    if (!activeWorkspace?.id) return;
    setLoading(true);
    setError(null);

    try {
      const [kitData, templatesData] = await Promise.all([
        apiFetch<BrandKitDetail>('/brand/kit'),
        apiFetch<ContentTemplateDetail[]>('/brand/templates'),
      ]);

      if (kitData) {
        setBrandKit(kitData);
        setPrimaryColor(kitData.primaryColor || '#6366f1');
        setSecondaryColor(kitData.secondaryColor || '#a855f7');
        setFontFamily(kitData.fontFamily || 'Inter');
        setLogoUrl(kitData.logoUrl || '');
        setWatermarkUrl(kitData.watermarkUrl || '');
        setDefaultCta(kitData.defaultCta || '');
        setHashtagsText((kitData.defaultHashtags || []).join(' '));
      }

      setTemplates(templatesData || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load brand kit');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrandData();
  }, [activeWorkspace?.id]);

  const handleSaveBrandKit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    const hashtags = hashtagsText
      .split(/\s+/)
      .filter((h) => h.startsWith('#'))
      .map((h) => h.trim());

    try {
      const updated = await apiFetch<BrandKitDetail>('/brand/kit', {
        method: 'PATCH',
        body: JSON.stringify({
          primaryColor,
          secondaryColor,
          fontFamily,
          logoUrl: logoUrl || null,
          watermarkUrl: watermarkUrl || null,
          defaultCta,
          defaultHashtags: hashtags,
        }),
      });
      setBrandKit(updated);
      setSuccessMsg('Brand kit settings saved successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update brand kit');
    } finally {
      setSaving(false);
    }
  };

  const handleUseTemplate = (t: ContentTemplateDetail) => {
    const encodedCaption = encodeURIComponent(t.templateData.caption);
    router.push(`/create?caption=${encodedCaption}`);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">White-Label Brand Kit & Templates</h1>
        <p className="mt-1 text-sm text-slate-400">
          Enforce visual brand consistency, watermarks, and viral post templates across{' '}
          <span className="font-semibold text-indigo-400">{activeWorkspace?.name}</span>
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-800/60 rounded-xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-xs text-emerald-300">
          {successMsg}
        </div>
      )}

      {/* Brand Kit Configuration Form */}
      <form onSubmit={handleSaveBrandKit} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
        <h2 className="text-base font-bold text-slate-100">Brand Identity & Watermark Overlay</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Brand Logo URL</label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Media Watermark Overlay URL</label>
            <input
              type="url"
              value={watermarkUrl}
              onChange={(e) => setWatermarkUrl(e.target.value)}
              placeholder="https://example.com/watermark.png"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Primary Brand Accent Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-9 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Secondary Accent Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-10 h-9 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Default Call-To-Action (CTA)</label>
            <input
              type="text"
              value={defaultCta}
              onChange={(e) => setDefaultCta(e.target.value)}
              placeholder="e.g. Visit omnipost.com to get started!"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Default Brand Hashtags</label>
            <input
              type="text"
              value={hashtagsText}
              onChange={(e) => setHashtagsText(e.target.value)}
              placeholder="#OmniPost #SaaS #Growth"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20"
          >
            {saving ? 'Saving Brand Kit...' : 'Save Brand Kit Settings'}
          </button>
        </div>
      </form>

      {/* Pre-made & Custom Viral Templates Gallery */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-slate-100">Viral Content Template Library</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((t) => (
            <div
              key={t.id}
              className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400">{t.category}</span>
                  {t.isGlobal && (
                    <span className="px-2 py-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 rounded-full">
                      GLOBAL VIRAL
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-100">{t.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                  {t.templateData.caption}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                <div className="flex gap-1 text-[10px] text-slate-500">
                  {t.templateData.recommendedPlatforms.map((p) => (
                    <span key={p} className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded">
                      {p}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleUseTemplate(t)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold rounded-lg"
                >
                  ⚡ Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
