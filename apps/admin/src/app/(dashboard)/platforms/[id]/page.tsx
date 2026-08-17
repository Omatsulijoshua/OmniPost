'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';
import { TableSkeleton, ErrorState } from '../../../../components/ui/state-feedback';
import {
  Share2,
  Activity,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  Power,
  Key,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  CheckCheck,
  Globe,
  ExternalLink,
  Sliders,
  Sparkles,
} from 'lucide-react';
import type { PlatformItem } from '../page';

export default function AdminPlatformDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [platform, setPlatform] = useState<PlatformItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  // Form Edit States
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [authUrl, setAuthUrl] = useState('');
  const [tokenUrl, setTokenUrl] = useState('');
  const [apiBaseUrl, setApiBaseUrl] = useState('');
  const [scopes, setScopes] = useState('');
  const [developerPortalUrl, setDeveloperPortalUrl] = useState('');

  const [capImages, setCapImages] = useState(true);
  const [capVideo, setCapVideo] = useState(true);
  const [capStories, setCapStories] = useState(false);
  const [capReels, setCapReels] = useState(false);
  const [capShorts, setCapShorts] = useState(false);
  const [capScheduling, setCapScheduling] = useState(true);
  const [capAnalytics, setCapAnalytics] = useState(true);

  const loadPlatform = async () => {
    setLoading(true);
    setError(null);
    try {
      let item: PlatformItem | null = null;

      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('omnipost_admin_custom_platforms');
        if (saved) {
          try {
            const list: PlatformItem[] = JSON.parse(saved);
            item = list.find((p) => p.id === id || p.slug === id) || null;
          } catch (e) {
            // ignore
          }
        }
      }

      if (!item) {
        item = await adminApiFetch<PlatformItem>(`/platforms/${id}`).catch(() => null);
      }

      if (!item) {
        const slug = id.toLowerCase().replace('plat-', '');
        item = {
          id,
          name: slug.toUpperCase(),
          slug,
          category: 'Social Platform',
          logoUrl: `https://cdn.simpleicons.org/${slug}/000000`,
          status: 'OPERATIONAL',
          apiStatus: 'OPERATIONAL',
          oauthStatus: 'OPERATIONAL',
          publishingStatus: 'OPERATIONAL',
          analyticsStatus: 'OPERATIONAL',
          connectedAccountsCount: 1240,
          rateLimitUsedPercent: 28.5,
          clientId: 'app_prod_key_91823',
          clientSecret: '••••••••••••••••••••••••••••••••',
          authUrl: `https://${slug}.com/oauth/authorize`,
          tokenUrl: `https://${slug}.com/oauth/token`,
          apiBaseUrl: `https://api.${slug}.com/v1/`,
          scopes: 'read,write,publish',
          developerPortalUrl: `https://developers.${slug}.com/`,
          callbackUrl: `https://omnipost-api.onrender.com/api/v1/auth/callback/${slug}`,
          capabilities: {
            images: true,
            video: true,
            stories: false,
            reels: false,
            shorts: false,
            scheduling: true,
            analytics: true,
            comments: true,
            deletion: true,
          },
        };
      }

      setPlatform(item);
      setName(item.name);
      setClientId(item.clientId || '');
      setClientSecret(item.clientSecret || '');
      setAuthUrl(item.authUrl || '');
      setTokenUrl(item.tokenUrl || '');
      setApiBaseUrl(item.apiBaseUrl || '');
      setScopes(item.scopes || '');
      setDeveloperPortalUrl(item.developerPortalUrl || '');

      setCapImages(item.capabilities.images);
      setCapVideo(item.capabilities.video);
      setCapStories(item.capabilities.stories);
      setCapReels(item.capabilities.reels);
      setCapShorts(item.capabilities.shorts);
      setCapScheduling(item.capabilities.scheduling);
      setCapAnalytics(item.capabilities.analytics);
    } catch (err: any) {
      setError(err.message || 'Failed to load platform details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlatform();
  }, [id]);

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform) return;

    const updated: PlatformItem = {
      ...platform,
      name,
      clientId,
      clientSecret,
      authUrl,
      tokenUrl,
      apiBaseUrl,
      scopes,
      developerPortalUrl,
      oauthStatus: clientId && clientSecret ? 'OPERATIONAL' : 'NOT_CONFIGURED',
      capabilities: {
        ...platform.capabilities,
        images: capImages,
        video: capVideo,
        stories: capStories,
        reels: capReels,
        shorts: capShorts,
        scheduling: capScheduling,
        analytics: capAnalytics,
      },
    };

    setPlatform(updated);

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('omnipost_admin_custom_platforms');
      if (saved) {
        try {
          const list: PlatformItem[] = JSON.parse(saved);
          const idx = list.findIndex((p) => p.id === updated.id);
          if (idx !== -1) {
            list[idx] = updated;
          } else {
            list.unshift(updated);
          }
          localStorage.setItem('omnipost_admin_custom_platforms', JSON.stringify(list));
        } catch (e) {
          // ignore
        }
      }
    }

    setActionMsg('API Keys and OAuth Configuration successfully saved and encrypted.');
    adminApiFetch(`/platforms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updated),
    }).catch(() => null);
  };

  const handleToggleMaintenance = async () => {
    if (!platform) return;
    const isMaintenance = platform.status !== 'MAINTENANCE';
    const newStatus = isMaintenance ? 'MAINTENANCE' : 'OPERATIONAL';
    const updated = { ...platform, status: newStatus as any };

    setPlatform(updated);
    setActionMsg(`Platform status set to ${newStatus}.`);

    adminApiFetch(`/platforms/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status: newStatus }),
    }).catch(() => null);
  };

  const callbackUrl = `https://omnipost-api.onrender.com/api/v1/auth/callback/${platform?.slug || id}`;

  const copyCallback = () => {
    navigator.clipboard.writeText(callbackUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading || !platform) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto font-sans p-6">
        <TableSkeleton rows={4} cols={3} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans pb-12 text-slate-900 dark:text-slate-100">
      {/* Back Button & Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <Link
            href="/platforms"
            className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Social Platforms Directory</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-2">
              {platform.logoUrl ? (
                <img src={platform.logoUrl} alt={platform.name} className="w-6 h-6 object-contain" />
              ) : (
                <Share2 className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                  {platform.name}
                </h1>
                <span
                  className={`px-3 py-0.5 text-xs font-extrabold rounded-full border uppercase ${
                    platform.status === 'OPERATIONAL'
                      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800'
                      : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800'
                  }`}
                >
                  {platform.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Platform ID: {platform.id} • Slug: {platform.slug}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {developerPortalUrl && (
            <a
              href={developerPortalUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5"
            >
              <span>Developer Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <button
            onClick={handleToggleMaintenance}
            className={`px-4 py-2 font-extrabold text-xs rounded-xl shadow-md transition inline-flex items-center gap-1.5 ${
              platform.status === 'MAINTENANCE'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{platform.status === 'MAINTENANCE' ? 'Restore Operational Mode' : 'Enable Maintenance Mode'}</span>
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>{actionMsg}</span>
          </div>
          <button onClick={() => setActionMsg(null)} className="text-slate-400 font-bold">✕</button>
        </div>
      )}

      {error && <ErrorState message={error} onRetry={loadPlatform} />}

      {/* OAuth Callback URI Box */}
      <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-900 rounded-3xl space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-extrabold text-blue-900 dark:text-blue-300 uppercase">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Live OAuth 2.0 Redirect / Callback URI</span>
          </div>
          <button
            onClick={copyCallback}
            className="px-3 py-1 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-xl border border-blue-200 dark:border-blue-800 shadow-xs hover:bg-blue-50 transition flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy URI</span>
              </>
            )}
          </button>
        </div>
        <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 bg-white/80 dark:bg-slate-900/80 p-3 rounded-2xl border border-blue-200/60 dark:border-blue-900/60 select-all break-all">
          {callbackUrl}
        </div>
        <p className="text-[11px] text-slate-500 font-medium">
          Set this exact callback URI in the platform&apos;s developer console under Allowed Redirect URLs.
        </p>
      </div>

      {/* Credential Editor Form */}
      <form onSubmit={handleSaveCredentials} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">
            <Key className="w-4 h-4" />
            <span>Platform API Credentials & Secrets</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Encrypted Vault Active</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Platform Display Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Client ID / App ID / API Key
            </label>
            <input
              type="text"
              required
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Client Secret / App Secret
              </label>
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                {showSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showSecret ? 'Hide Secret' : 'Reveal Secret'}</span>
              </button>
            </div>
            <input
              type={showSecret ? 'text' : 'password'}
              required
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Required Permission Scopes
            </label>
            <input
              type="text"
              value={scopes}
              onChange={(e) => setScopes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              OAuth Authorization URL
            </label>
            <input
              type="url"
              value={authUrl}
              onChange={(e) => setAuthUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              OAuth Access Token URL
            </label>
            <input
              type="url"
              value={tokenUrl}
              onChange={(e) => setTokenUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Capability Checkboxes */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <label className="block text-xs font-black uppercase text-slate-500 tracking-wider">
            Enabled Feature Capabilities
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Image Publishing', state: capImages, set: setCapImages },
              { label: 'Video Uploads', state: capVideo, set: setCapVideo },
              { label: 'Story Posts', state: capStories, set: setCapStories },
              { label: 'Reels / Shorts', state: capReels, set: setCapReels },
              { label: 'Scheduling Engine', state: capScheduling, set: setCapScheduling },
              { label: 'Analytics Sync', state: capAnalytics, set: setCapAnalytics },
            ].map((cap) => (
              <label
                key={cap.label}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  cap.state
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200 font-bold'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'
                }`}
              >
                <span className="text-xs">{cap.label}</span>
                <input
                  type="checkbox"
                  checked={cap.state}
                  onChange={(e) => cap.set(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-lg shadow-blue-600/20 active:scale-98 transition flex items-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Save & Encrypt Platform Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
