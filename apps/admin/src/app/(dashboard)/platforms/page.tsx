'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../lib/api-client';
import { TableSkeleton, ErrorState } from '../../../components/ui/state-feedback';
import {
  Share2,
  Check,
  X as XIcon,
  AlertTriangle,
  Activity,
  Sliders,
  ShieldCheck,
  Plus,
  Key,
  Lock,
  Eye,
  EyeOff,
  Copy,
  CheckCheck,
  Globe,
  ExternalLink,
  Trash2,
  Edit3,
  Sparkles,
  Info,
  Server,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export interface PlatformItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  logoUrl?: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE' | 'OUTAGE';
  apiStatus: 'OPERATIONAL' | 'DEGRADED' | 'DOWN';
  oauthStatus: 'OPERATIONAL' | 'EXPIRED_CLIENT_SECRET' | 'NOT_CONFIGURED';
  publishingStatus: 'OPERATIONAL' | 'PAUSED';
  analyticsStatus: 'OPERATIONAL' | 'DEGRADED' | 'NOT_SUPPORTED';
  connectedAccountsCount: number;
  rateLimitUsedPercent: number;
  lastError?: string | null;
  // OAuth & API Key Configuration
  clientId?: string;
  clientSecret?: string;
  authUrl?: string;
  tokenUrl?: string;
  callbackUrl?: string;
  apiBaseUrl?: string;
  scopes?: string;
  developerPortalUrl?: string;
  // Limits
  maxCaptionLength?: number;
  maxVideoSizeMB?: number;
  maxVideoDurationSec?: number;
  // Capabilities
  capabilities: {
    images: boolean;
    video: boolean;
    stories: boolean;
    reels: boolean;
    shorts: boolean;
    scheduling: boolean;
    analytics: boolean;
    comments: boolean;
    deletion: boolean;
  };
}

const PRESET_TEMPLATES: Record<string, Partial<PlatformItem>> = {
  tiktok: {
    name: 'TikTok',
    slug: 'tiktok',
    category: 'Short-Form Video',
    logoUrl: 'https://cdn.simpleicons.org/tiktok/000000',
    authUrl: 'https://www.tiktok.com/v2/auth/authorize/',
    tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
    apiBaseUrl: 'https://open.tiktokapis.com/v2/',
    scopes: 'user.info.basic,video.upload,video.publish',
    developerPortalUrl: 'https://developers.tiktok.com/',
    maxCaptionLength: 4000,
    maxVideoSizeMB: 500,
    maxVideoDurationSec: 600,
    capabilities: { images: true, video: true, stories: false, reels: false, shorts: true, scheduling: true, analytics: true, comments: true, deletion: false },
  },
  instagram: {
    name: 'Instagram (Graph API)',
    slug: 'instagram',
    category: 'Visual & Reels',
    logoUrl: 'https://cdn.simpleicons.org/instagram/E4405F',
    authUrl: 'https://www.facebook.com/v20.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v20.0/oauth/access_token',
    apiBaseUrl: 'https://graph.facebook.com/v20.0/',
    scopes: 'instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement',
    developerPortalUrl: 'https://developers.facebook.com/apps/',
    maxCaptionLength: 2200,
    maxVideoSizeMB: 300,
    maxVideoDurationSec: 900,
    capabilities: { images: true, video: true, stories: true, reels: true, shorts: false, scheduling: true, analytics: true, comments: true, deletion: true },
  },
  youtube: {
    name: 'YouTube',
    slug: 'youtube',
    category: 'Long-Form & Shorts',
    logoUrl: 'https://cdn.simpleicons.org/youtube/FF0000',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    apiBaseUrl: 'https://www.googleapis.com/youtube/v3/',
    scopes: 'https://www.googleapis.com/auth/youtube.upload,https://www.googleapis.com/auth/youtube.readonly',
    developerPortalUrl: 'https://console.cloud.google.com/apis/credentials',
    maxCaptionLength: 5000,
    maxVideoSizeMB: 2048,
    maxVideoDurationSec: 43200,
    capabilities: { images: false, video: true, stories: false, reels: false, shorts: true, scheduling: true, analytics: true, comments: true, deletion: true },
  },
  x: {
    name: 'X (Twitter)',
    slug: 'x',
    category: 'Microblog & Media',
    logoUrl: 'https://cdn.simpleicons.org/x/000000',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    apiBaseUrl: 'https://api.twitter.com/2/',
    scopes: 'tweet.read,tweet.write,users.read,offline.access',
    developerPortalUrl: 'https://developer.x.com/en/portal/dashboard',
    maxCaptionLength: 280,
    maxVideoSizeMB: 512,
    maxVideoDurationSec: 140,
    capabilities: { images: true, video: true, stories: false, reels: false, shorts: false, scheduling: true, analytics: true, comments: true, deletion: true },
  },
  linkedin: {
    name: 'LinkedIn',
    slug: 'linkedin',
    category: 'Professional Network',
    logoUrl: 'https://cdn.simpleicons.org/linkedin/0A66C2',
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    apiBaseUrl: 'https://api.linkedin.com/v2/',
    scopes: 'r_liteprofile,r_emailaddress,w_member_social,rw_organization_admin',
    developerPortalUrl: 'https://www.linkedin.com/developers/apps',
    maxCaptionLength: 3000,
    maxVideoSizeMB: 500,
    maxVideoDurationSec: 600,
    capabilities: { images: true, video: true, stories: false, reels: false, shorts: false, scheduling: true, analytics: true, comments: true, deletion: true },
  },
  threads: {
    name: 'Threads',
    slug: 'threads',
    category: 'Microblog & Media',
    logoUrl: 'https://cdn.simpleicons.org/threads/000000',
    authUrl: 'https://threads.net/oauth/authorize',
    tokenUrl: 'https://graph.threads.net/oauth/access_token',
    apiBaseUrl: 'https://graph.threads.net/v1.0/',
    scopes: 'threads_basic,threads_content_publish,threads_read_replies,threads_manage_replies',
    developerPortalUrl: 'https://developers.facebook.com/products/threads-api',
    maxCaptionLength: 500,
    maxVideoSizeMB: 250,
    maxVideoDurationSec: 300,
    capabilities: { images: true, video: true, stories: false, reels: false, shorts: false, scheduling: true, analytics: true, comments: true, deletion: false },
  },
  pinterest: {
    name: 'Pinterest',
    slug: 'pinterest',
    category: 'Visual Discovery',
    logoUrl: 'https://cdn.simpleicons.org/pinterest/BD081C',
    authUrl: 'https://www.pinterest.com/oauth/',
    tokenUrl: 'https://api.pinterest.com/v5/oauth/token',
    apiBaseUrl: 'https://api.pinterest.com/v5/',
    scopes: 'boards:read,boards:write,pins:read,pins:write,user_accounts:read',
    developerPortalUrl: 'https://developers.pinterest.com/apps/',
    maxCaptionLength: 500,
    maxVideoSizeMB: 200,
    maxVideoDurationSec: 900,
    capabilities: { images: true, video: true, stories: false, reels: false, shorts: false, scheduling: true, analytics: true, comments: false, deletion: true },
  },
  telegram: {
    name: 'Telegram Bot & Channels',
    slug: 'telegram',
    category: 'Messaging & Broadcast',
    logoUrl: 'https://cdn.simpleicons.org/telegram/26A5E4',
    authUrl: '',
    tokenUrl: '',
    apiBaseUrl: 'https://api.telegram.org/bot',
    scopes: 'bot_token_direct',
    developerPortalUrl: 'https://t.me/BotFather',
    maxCaptionLength: 1024,
    maxVideoSizeMB: 50,
    maxVideoDurationSec: 3600,
    capabilities: { images: true, video: true, stories: false, reels: false, shorts: false, scheduling: true, analytics: false, comments: true, deletion: true },
  },
  discord: {
    name: 'Discord Webhook & Bots',
    slug: 'discord',
    category: 'Community & Channels',
    logoUrl: 'https://cdn.simpleicons.org/discord/5865F2',
    authUrl: 'https://discord.com/oauth2/authorize',
    tokenUrl: 'https://discord.com/api/v10/oauth2/token',
    apiBaseUrl: 'https://discord.com/api/v10/',
    scopes: 'bot,applications.commands,webhook.incoming',
    developerPortalUrl: 'https://discord.com/developers/applications',
    maxCaptionLength: 2000,
    maxVideoSizeMB: 25,
    maxVideoDurationSec: 300,
    capabilities: { images: true, video: true, stories: false, reels: false, shorts: false, scheduling: true, analytics: false, comments: true, deletion: true },
  },
  reddit: {
    name: 'Reddit',
    slug: 'reddit',
    category: 'Community & Subreddits',
    logoUrl: 'https://cdn.simpleicons.org/reddit/FF4500',
    authUrl: 'https://www.reddit.com/api/v1/authorize',
    tokenUrl: 'https://www.reddit.com/api/v1/access_token',
    apiBaseUrl: 'https://oauth.reddit.com/api/',
    scopes: 'identity,edit,flair,history,mysubreddits,posts,read,submit',
    developerPortalUrl: 'https://www.reddit.com/prefs/apps',
    maxCaptionLength: 40000,
    maxVideoSizeMB: 1000,
    maxVideoDurationSec: 900,
    capabilities: { images: true, video: true, stories: false, reels: false, shorts: false, scheduling: true, analytics: true, comments: true, deletion: true },
  },
  bluesky: {
    name: 'Bluesky (AT Protocol)',
    slug: 'bluesky',
    category: 'Decentralized Social',
    logoUrl: 'https://cdn.simpleicons.org/bluesky/0285FF',
    authUrl: 'https://bsky.social/xrpc/com.atproto.server.createSession',
    tokenUrl: 'https://bsky.social/xrpc/com.atproto.server.refreshSession',
    apiBaseUrl: 'https://bsky.social/xrpc/',
    scopes: 'app_password,atproto_write',
    developerPortalUrl: 'https://bsky.app/settings/app-passwords',
    maxCaptionLength: 300,
    maxVideoSizeMB: 50,
    maxVideoDurationSec: 60,
    capabilities: { images: true, video: true, stories: false, reels: false, shorts: false, scheduling: true, analytics: true, comments: true, deletion: true },
  },
};

const INITIAL_PLATFORMS: PlatformItem[] = [
  {
    id: 'plat-instagram',
    name: 'Instagram (Graph API)',
    slug: 'instagram',
    category: 'Visual & Reels',
    logoUrl: 'https://cdn.simpleicons.org/instagram/E4405F',
    status: 'OPERATIONAL',
    apiStatus: 'OPERATIONAL',
    oauthStatus: 'OPERATIONAL',
    publishingStatus: 'OPERATIONAL',
    analyticsStatus: 'OPERATIONAL',
    connectedAccountsCount: 2840,
    rateLimitUsedPercent: 34.2,
    clientId: '619284710293847',
    clientSecret: '••••••••••••••••••••••••••••••••',
    callbackUrl: 'https://omnipost-api.onrender.com/api/v1/auth/callback/instagram',
    developerPortalUrl: 'https://developers.facebook.com/apps/',
    capabilities: { images: true, video: true, stories: true, reels: true, shorts: false, scheduling: true, analytics: true, comments: true, deletion: true },
  },
  {
    id: 'plat-tiktok',
    name: 'TikTok',
    slug: 'tiktok',
    category: 'Short-Form Video',
    logoUrl: 'https://cdn.simpleicons.org/tiktok/000000',
    status: 'OPERATIONAL',
    apiStatus: 'OPERATIONAL',
    oauthStatus: 'OPERATIONAL',
    publishingStatus: 'OPERATIONAL',
    analyticsStatus: 'OPERATIONAL',
    connectedAccountsCount: 2190,
    rateLimitUsedPercent: 42.4,
    clientId: 'aw1928hd8172h309',
    clientSecret: '••••••••••••••••••••••••••••••••',
    callbackUrl: 'https://omnipost-api.onrender.com/api/v1/auth/callback/tiktok',
    developerPortalUrl: 'https://developers.tiktok.com/',
    capabilities: { images: true, video: true, stories: false, reels: false, shorts: true, scheduling: true, analytics: true, comments: true, deletion: false },
  },
  {
    id: 'plat-youtube',
    name: 'YouTube',
    slug: 'youtube',
    category: 'Long-Form & Shorts',
    logoUrl: 'https://cdn.simpleicons.org/youtube/FF0000',
    status: 'OPERATIONAL',
    apiStatus: 'OPERATIONAL',
    oauthStatus: 'OPERATIONAL',
    publishingStatus: 'OPERATIONAL',
    analyticsStatus: 'OPERATIONAL',
    connectedAccountsCount: 1640,
    rateLimitUsedPercent: 12.8,
    clientId: '849102837482-apps.googleusercontent.com',
    clientSecret: '••••••••••••••••••••••••••••••••',
    callbackUrl: 'https://omnipost-api.onrender.com/api/v1/auth/callback/youtube',
    developerPortalUrl: 'https://console.cloud.google.com/apis/credentials',
    capabilities: { images: false, video: true, stories: false, reels: false, shorts: true, scheduling: true, analytics: true, comments: true, deletion: true },
  },
  {
    id: 'plat-x',
    name: 'X (Twitter)',
    slug: 'x',
    category: 'Microblog & Media',
    logoUrl: 'https://cdn.simpleicons.org/x/000000',
    status: 'OPERATIONAL',
    apiStatus: 'OPERATIONAL',
    oauthStatus: 'OPERATIONAL',
    publishingStatus: 'OPERATIONAL',
    analyticsStatus: 'OPERATIONAL',
    connectedAccountsCount: 1850,
    rateLimitUsedPercent: 41.5,
    clientId: 'Vk5NTXpBdGJ1SThfU05OQ2Vn',
    clientSecret: '••••••••••••••••••••••••••••••••',
    callbackUrl: 'https://omnipost-api.onrender.com/api/v1/auth/callback/x',
    developerPortalUrl: 'https://developer.x.com/en/portal/dashboard',
    capabilities: { images: true, video: true, stories: false, reels: false, shorts: false, scheduling: true, analytics: true, comments: true, deletion: true },
  },
  {
    id: 'plat-linkedin',
    name: 'LinkedIn',
    slug: 'linkedin',
    category: 'Professional Network',
    logoUrl: 'https://cdn.simpleicons.org/linkedin/0A66C2',
    status: 'OPERATIONAL',
    apiStatus: 'OPERATIONAL',
    oauthStatus: 'OPERATIONAL',
    publishingStatus: 'OPERATIONAL',
    analyticsStatus: 'OPERATIONAL',
    connectedAccountsCount: 940,
    rateLimitUsedPercent: 15.6,
    clientId: '78kwjs8271hd83',
    clientSecret: '••••••••••••••••••••••••••••••••',
    callbackUrl: 'https://omnipost-api.onrender.com/api/v1/auth/callback/linkedin',
    developerPortalUrl: 'https://www.linkedin.com/developers/apps',
    capabilities: { images: true, video: true, stories: false, reels: false, shorts: false, scheduling: true, analytics: true, comments: true, deletion: true },
  },
  {
    id: 'plat-threads',
    name: 'Threads',
    slug: 'threads',
    category: 'Microblog & Media',
    logoUrl: 'https://cdn.simpleicons.org/threads/000000',
    status: 'OPERATIONAL',
    apiStatus: 'OPERATIONAL',
    oauthStatus: 'OPERATIONAL',
    publishingStatus: 'OPERATIONAL',
    analyticsStatus: 'OPERATIONAL',
    connectedAccountsCount: 420,
    rateLimitUsedPercent: 8.4,
    clientId: '91827461928374',
    clientSecret: '••••••••••••••••••••••••••••••••',
    callbackUrl: 'https://omnipost-api.onrender.com/api/v1/auth/callback/threads',
    developerPortalUrl: 'https://developers.facebook.com/products/threads-api',
    capabilities: { images: true, video: true, stories: false, reels: false, shorts: false, scheduling: true, analytics: true, comments: true, deletion: false },
  },
  {
    id: 'plat-pinterest',
    name: 'Pinterest',
    slug: 'pinterest',
    category: 'Visual Discovery',
    logoUrl: 'https://cdn.simpleicons.org/pinterest/BD081C',
    status: 'OPERATIONAL',
    apiStatus: 'OPERATIONAL',
    oauthStatus: 'OPERATIONAL',
    publishingStatus: 'OPERATIONAL',
    analyticsStatus: 'OPERATIONAL',
    connectedAccountsCount: 310,
    rateLimitUsedPercent: 5.2,
    clientId: '1491827',
    clientSecret: '••••••••••••••••••••••••••••••••',
    callbackUrl: 'https://omnipost-api.onrender.com/api/v1/auth/callback/pinterest',
    developerPortalUrl: 'https://developers.pinterest.com/apps/',
    capabilities: { images: true, video: true, stories: false, reels: false, shorts: false, scheduling: true, analytics: true, comments: false, deletion: true },
  },
  {
    id: 'plat-telegram',
    name: 'Telegram',
    slug: 'telegram',
    category: 'Messaging & Broadcast',
    logoUrl: 'https://cdn.simpleicons.org/telegram/26A5E4',
    status: 'OPERATIONAL',
    apiStatus: 'OPERATIONAL',
    oauthStatus: 'OPERATIONAL',
    publishingStatus: 'OPERATIONAL',
    analyticsStatus: 'NOT_SUPPORTED',
    connectedAccountsCount: 680,
    rateLimitUsedPercent: 19.3,
    clientId: 'bot6192847192:AAEj',
    clientSecret: '••••••••••••••••••••••••••••••••',
    callbackUrl: 'https://omnipost-api.onrender.com/api/v1/auth/callback/telegram',
    developerPortalUrl: 'https://t.me/BotFather',
    capabilities: { images: true, video: true, stories: false, reels: false, shorts: false, scheduling: true, analytics: false, comments: true, deletion: true },
  },
  {
    id: 'plat-discord',
    name: 'Discord',
    slug: 'discord',
    category: 'Community & Channels',
    logoUrl: 'https://cdn.simpleicons.org/discord/5865F2',
    status: 'OPERATIONAL',
    apiStatus: 'OPERATIONAL',
    oauthStatus: 'OPERATIONAL',
    publishingStatus: 'OPERATIONAL',
    analyticsStatus: 'NOT_SUPPORTED',
    connectedAccountsCount: 540,
    rateLimitUsedPercent: 11.2,
    clientId: '128491028374619283',
    clientSecret: '••••••••••••••••••••••••••••••••',
    callbackUrl: 'https://omnipost-api.onrender.com/api/v1/auth/callback/discord',
    developerPortalUrl: 'https://discord.com/developers/applications',
    capabilities: { images: true, video: true, stories: false, reels: false, shorts: false, scheduling: true, analytics: false, comments: true, deletion: true },
  },
  {
    id: 'plat-reddit',
    name: 'Reddit',
    slug: 'reddit',
    category: 'Community & Subreddits',
    logoUrl: 'https://cdn.simpleicons.org/reddit/FF4500',
    status: 'OPERATIONAL',
    apiStatus: 'OPERATIONAL',
    oauthStatus: 'OPERATIONAL',
    publishingStatus: 'OPERATIONAL',
    analyticsStatus: 'OPERATIONAL',
    connectedAccountsCount: 380,
    rateLimitUsedPercent: 14.1,
    clientId: 'a9K81ls9102ks',
    clientSecret: '••••••••••••••••••••••••••••••••',
    callbackUrl: 'https://omnipost-api.onrender.com/api/v1/auth/callback/reddit',
    developerPortalUrl: 'https://www.reddit.com/prefs/apps',
    capabilities: { images: true, video: true, stories: false, reels: false, shorts: false, scheduling: true, analytics: true, comments: true, deletion: true },
  },
  {
    id: 'plat-bluesky',
    name: 'Bluesky (AT Protocol)',
    slug: 'bluesky',
    category: 'Decentralized Social',
    logoUrl: 'https://cdn.simpleicons.org/bluesky/0285FF',
    status: 'OPERATIONAL',
    apiStatus: 'OPERATIONAL',
    oauthStatus: 'OPERATIONAL',
    publishingStatus: 'OPERATIONAL',
    analyticsStatus: 'OPERATIONAL',
    connectedAccountsCount: 220,
    rateLimitUsedPercent: 3.8,
    clientId: 'omnipost.bsky.social',
    clientSecret: '••••••••••••••••••••••••••••••••',
    callbackUrl: 'https://omnipost-api.onrender.com/api/v1/auth/callback/bluesky',
    developerPortalUrl: 'https://bsky.app/settings/app-passwords',
    capabilities: { images: true, video: true, stories: false, reels: false, shorts: false, scheduling: true, analytics: true, comments: true, deletion: true },
  },
];

export default function AdminPlatformsPage() {
  const [platforms, setPlatforms] = useState<PlatformItem[]>([]);
  const [activeTab, setActiveTab] = useState<'TELEMETRY' | 'CAPABILITY_MATRIX'>('TELEMETRY');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Add / Edit Platform Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<PlatformItem | null>(null);
  const [showSecret, setShowSecret] = useState(false);

  // Modal Form State
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState('Social Media');
  const [formLogoUrl, setFormLogoUrl] = useState('');
  const [formClientId, setFormClientId] = useState('');
  const [formClientSecret, setFormClientSecret] = useState('');
  const [formAuthUrl, setFormAuthUrl] = useState('');
  const [formTokenUrl, setFormTokenUrl] = useState('');
  const [formApiBaseUrl, setFormApiBaseUrl] = useState('');
  const [formScopes, setFormScopes] = useState('');
  const [formDeveloperPortalUrl, setFormDeveloperPortalUrl] = useState('');
  const [formMaxCaption, setFormMaxCaption] = useState(2200);
  const [formMaxVideoMB, setFormMaxVideoMB] = useState(500);
  const [formMaxVideoSec, setFormMaxVideoSec] = useState(600);
  const [formStatus, setFormStatus] = useState<PlatformItem['status']>('OPERATIONAL');

  // Capability Toggles
  const [capImages, setCapImages] = useState(true);
  const [capVideo, setCapVideo] = useState(true);
  const [capStories, setCapStories] = useState(false);
  const [capReels, setCapReels] = useState(false);
  const [capShorts, setCapShorts] = useState(false);
  const [capScheduling, setCapScheduling] = useState(true);
  const [capAnalytics, setCapAnalytics] = useState(true);
  const [capComments, setCapComments] = useState(true);
  const [capDeletion, setCapDeletion] = useState(true);

  const loadPlatforms = async () => {
    setLoading(true);
    setError(null);
    try {
      let stored: PlatformItem[] | null = null;
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('omnipost_admin_custom_platforms');
        if (saved) {
          try {
            stored = JSON.parse(saved);
          } catch (e) {
            // ignore
          }
        }
      }

      if (stored && stored.length > 0) {
        setPlatforms(stored);
      } else {
        const data = await adminApiFetch<PlatformItem[]>('/platforms').catch(() => INITIAL_PLATFORMS);
        setPlatforms(data || INITIAL_PLATFORMS);
        if (typeof window !== 'undefined') {
          localStorage.setItem('omnipost_admin_custom_platforms', JSON.stringify(data || INITIAL_PLATFORMS));
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load platform telemetry');
      setPlatforms(INITIAL_PLATFORMS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlatforms();
  }, []);

  const savePlatformsState = (updatedList: PlatformItem[]) => {
    setPlatforms(updatedList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('omnipost_admin_custom_platforms', JSON.stringify(updatedList));
    }
  };

  // Open Modal for New Platform
  const handleOpenAddModal = (presetKey?: string) => {
    setEditingPlatform(null);
    setShowSecret(false);

    if (presetKey && PRESET_TEMPLATES[presetKey]) {
      const p = PRESET_TEMPLATES[presetKey];
      setFormName(p.name || '');
      setFormSlug(p.slug || '');
      setFormCategory(p.category || 'Social Media');
      setFormLogoUrl(p.logoUrl || '');
      setFormClientId('');
      setFormClientSecret('');
      setFormAuthUrl(p.authUrl || '');
      setFormTokenUrl(p.tokenUrl || '');
      setFormApiBaseUrl(p.apiBaseUrl || '');
      setFormScopes(p.scopes || '');
      setFormDeveloperPortalUrl(p.developerPortalUrl || '');
      setFormMaxCaption(p.maxCaptionLength || 2200);
      setFormMaxVideoMB(p.maxVideoSizeMB || 500);
      setFormMaxVideoSec(p.maxVideoDurationSec || 600);
      setFormStatus('OPERATIONAL');

      setCapImages(p.capabilities?.images ?? true);
      setCapVideo(p.capabilities?.video ?? true);
      setCapStories(p.capabilities?.stories ?? false);
      setCapReels(p.capabilities?.reels ?? false);
      setCapShorts(p.capabilities?.shorts ?? false);
      setCapScheduling(p.capabilities?.scheduling ?? true);
      setCapAnalytics(p.capabilities?.analytics ?? true);
      setCapComments(p.capabilities?.comments ?? true);
      setCapDeletion(p.capabilities?.deletion ?? true);
    } else {
      setFormName('');
      setFormSlug('');
      setFormCategory('Social Media');
      setFormLogoUrl('');
      setFormClientId('');
      setFormClientSecret('');
      setFormAuthUrl('');
      setFormTokenUrl('');
      setFormApiBaseUrl('');
      setFormScopes('');
      setFormDeveloperPortalUrl('');
      setFormMaxCaption(2200);
      setFormMaxVideoMB(500);
      setFormMaxVideoSec(600);
      setFormStatus('OPERATIONAL');

      setCapImages(true);
      setCapVideo(true);
      setCapStories(false);
      setCapReels(false);
      setCapShorts(false);
      setCapScheduling(true);
      setCapAnalytics(true);
      setCapComments(true);
      setCapDeletion(true);
    }

    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (p: PlatformItem) => {
    setEditingPlatform(p);
    setShowSecret(false);

    setFormName(p.name);
    setFormSlug(p.slug);
    setFormCategory(p.category || 'Social Media');
    setFormLogoUrl(p.logoUrl || '');
    setFormClientId(p.clientId || '');
    setFormClientSecret(p.clientSecret || '');
    setFormAuthUrl(p.authUrl || '');
    setFormTokenUrl(p.tokenUrl || '');
    setFormApiBaseUrl(p.apiBaseUrl || '');
    setFormScopes(p.scopes || '');
    setFormDeveloperPortalUrl(p.developerPortalUrl || '');
    setFormMaxCaption(p.maxCaptionLength || 2200);
    setFormMaxVideoMB(p.maxVideoSizeMB || 500);
    setFormMaxVideoSec(p.maxVideoDurationSec || 600);
    setFormStatus(p.status);

    setCapImages(p.capabilities.images);
    setCapVideo(p.capabilities.video);
    setCapStories(p.capabilities.stories);
    setCapReels(p.capabilities.reels);
    setCapShorts(p.capabilities.shorts);
    setCapScheduling(p.capabilities.scheduling);
    setCapAnalytics(p.capabilities.analytics);
    setCapComments(p.capabilities.comments);
    setCapDeletion(p.capabilities.deletion);

    setIsModalOpen(true);
  };

  // Save Platform (Create or Update)
  const handleSavePlatform = async (e: React.FormEvent) => {
    e.preventDefault();

    const slugClean = (formSlug || formName).toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const dynamicCallback = `https://omnipost-api.onrender.com/api/v1/auth/callback/${slugClean}`;

    const newOrUpdated: PlatformItem = {
      id: editingPlatform ? editingPlatform.id : `plat-${slugClean}-${Date.now().toString().slice(-4)}`,
      name: formName.trim(),
      slug: slugClean,
      category: formCategory,
      logoUrl: formLogoUrl.trim() || undefined,
      status: formStatus,
      apiStatus: 'OPERATIONAL',
      oauthStatus: formClientId && formClientSecret ? 'OPERATIONAL' : 'NOT_CONFIGURED',
      publishingStatus: 'OPERATIONAL',
      analyticsStatus: capAnalytics ? 'OPERATIONAL' : 'NOT_SUPPORTED',
      connectedAccountsCount: editingPlatform ? editingPlatform.connectedAccountsCount : 0,
      rateLimitUsedPercent: editingPlatform ? editingPlatform.rateLimitUsedPercent : 0,
      lastError: null,
      clientId: formClientId.trim(),
      clientSecret: formClientSecret.trim(),
      authUrl: formAuthUrl.trim(),
      tokenUrl: formTokenUrl.trim(),
      callbackUrl: dynamicCallback,
      apiBaseUrl: formApiBaseUrl.trim(),
      scopes: formScopes.trim(),
      developerPortalUrl: formDeveloperPortalUrl.trim(),
      maxCaptionLength: formMaxCaption,
      maxVideoSizeMB: formMaxVideoMB,
      maxVideoDurationSec: formMaxVideoSec,
      capabilities: {
        images: capImages,
        video: capVideo,
        stories: capStories,
        reels: capReels,
        shorts: capShorts,
        scheduling: capScheduling,
        analytics: capAnalytics,
        comments: capComments,
        deletion: capDeletion,
      },
    };

    let updatedList: PlatformItem[];
    if (editingPlatform) {
      updatedList = platforms.map((item) => (item.id === editingPlatform.id ? newOrUpdated : item));
      setActionMsg(`Platform "${formName}" credentials and configuration updated successfully.`);
    } else {
      updatedList = [newOrUpdated, ...platforms];
      setActionMsg(`Platform "${formName}" added successfully with live OAuth callback: ${dynamicCallback}`);
    }

    savePlatformsState(updatedList);
    setIsModalOpen(false);

    // Send payload to backend API asynchronously
    adminApiFetch('/platforms', {
      method: 'POST',
      body: JSON.stringify(newOrUpdated),
    }).catch(() => null);
  };

  const handleDeletePlatform = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete platform "${name}"? Existing connections may be affected.`)) {
      return;
    }
    const updated = platforms.filter((p) => p.id !== id);
    savePlatformsState(updated);
    setActionMsg(`Platform "${name}" was removed.`);

    adminApiFetch(`/platforms/${id}`, { method: 'DELETE' }).catch(() => null);
  };

  const handleCopyCallback = (slug: string) => {
    const cb = `https://omnipost-api.onrender.com/api/v1/auth/callback/${slug}`;
    navigator.clipboard.writeText(cb);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const handleToggleMaintenance = async (p: PlatformItem) => {
    const newStatus: PlatformItem['status'] = p.status === 'MAINTENANCE' ? 'OPERATIONAL' : 'MAINTENANCE';
    const updated = platforms.map((item) => (item.id === p.id ? { ...item, status: newStatus } : item));
    savePlatformsState(updated);
    setActionMsg(`Platform ${p.name} status updated to ${newStatus}.`);

    adminApiFetch(`/platforms/${p.id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status: newStatus }),
    }).catch(() => null);
  };

  const calculatedCallbackUrl = `https://omnipost-api.onrender.com/api/v1/auth/callback/${
    (formSlug || formName || 'platform-code').toLowerCase().replace(/[^a-z0-9]/g, '-')
  }`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12 text-slate-900 dark:text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
              <Share2 className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              Social Platform Integrations & Key Manager
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium pl-10">
            Configure OAuth 2.0 Client IDs, App Secrets, custom Redirect Callbacks, publishing limits, and capability matrices.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Tab Switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('TELEMETRY')}
              className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition ${
                activeTab === 'TELEMETRY' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Platform Telemetry ({platforms.length})
            </button>
            <button
              onClick={() => setActiveTab('CAPABILITY_MATRIX')}
              className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition ${
                activeTab === 'CAPABILITY_MATRIX' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Capability Matrix
            </button>
          </div>

          {/* + Add New Platform Button */}
          <button
            onClick={() => handleOpenAddModal()}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black rounded-xl shadow-lg shadow-blue-600/20 active:scale-98 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New Platform</span>
          </button>
        </div>
      </div>

      {/* Action Notification Message */}
      {actionMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{actionMsg}</span>
          </div>
          <button
            onClick={() => setActionMsg(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {error && <ErrorState message={error} onRetry={loadPlatforms} />}

      {/* Quick Add Platform Presets Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between text-xs font-extrabold text-slate-500 uppercase tracking-wider">
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Platform Templates (1-Click Auto-Fill)</span>
          </div>
          <span className="text-[11px] font-medium text-slate-400">Pre-configured OAuth URLs & Scopes</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {Object.entries(PRESET_TEMPLATES).map(([key, template]) => (
            <button
              key={key}
              onClick={() => handleOpenAddModal(key)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-300 dark:hover:border-blue-700 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition flex items-center gap-2 group"
            >
              {template.logoUrl ? (
                <img src={template.logoUrl} alt={template.name} className="w-3.5 h-3.5 object-contain" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-blue-500" />
              )}
              <span>+ {template.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Platform Telemetry & Key Management Cards */}
      {activeTab === 'TELEMETRY' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {platforms.map((p) => (
            <div
              key={p.id}
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-4 flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-800 transition"
            >
              <div className="space-y-3.5">
                {/* Card Header with Logo & Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-2">
                      {p.logoUrl ? (
                        <img src={p.logoUrl} alt={p.name} className="w-6 h-6 object-contain" />
                      ) : (
                        <Share2 className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight">
                        {p.name}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {p.category || 'Social Platform'}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-black rounded-full border uppercase ${
                      p.status === 'OPERATIONAL'
                        ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800'
                        : p.status === 'MAINTENANCE'
                        ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800'
                        : 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                {/* OAuth & API Key Status Box */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>API Credentials:</span>
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        p.clientId && p.clientSecret
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {p.clientId && p.clientSecret ? 'Keys Active ✓' : 'Keys Needed ⚠️'}
                    </span>
                  </div>

                  {/* Masked App ID / Client ID */}
                  <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                    <span>App Client ID:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {p.clientId ? `${p.clientId.slice(0, 8)}••••` : 'Not configured'}
                    </span>
                  </div>

                  {/* Redirect Callback URL */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold mb-1">
                      <span>OAuth Callback URI:</span>
                      <button
                        onClick={() => handleCopyCallback(p.slug)}
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        {copiedSlug === p.slug ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy URI</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="text-[10px] font-mono bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 truncate">
                      https://omnipost-api.onrender.com/api/v1/auth/callback/{p.slug}
                    </div>
                  </div>
                </div>

                {/* Telemetry Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Connected Users</div>
                    <div className="font-black text-slate-900 dark:text-slate-100 mt-0.5">
                      {p.connectedAccountsCount.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Rate Limit Used</div>
                    <div className="font-mono font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                      {p.rateLimitUsedPercent}%
                    </div>
                  </div>
                </div>

                {/* Active Capability Badges */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {p.capabilities.video && (
                    <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 text-[9px] font-extrabold rounded-md border border-blue-200 dark:border-blue-900">
                      Video
                    </span>
                  )}
                  {p.capabilities.images && (
                    <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[9px] font-extrabold rounded-md border border-emerald-200 dark:border-emerald-900">
                      Images
                    </span>
                  )}
                  {p.capabilities.reels && (
                    <span className="px-2 py-0.5 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 text-[9px] font-extrabold rounded-md border border-purple-200 dark:border-purple-900">
                      Reels
                    </span>
                  )}
                  {p.capabilities.shorts && (
                    <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 text-[9px] font-extrabold rounded-md border border-rose-200 dark:border-rose-900">
                      Shorts
                    </span>
                  )}
                  {p.capabilities.analytics && (
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[9px] font-extrabold rounded-md">
                      Analytics Sync
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenEditModal(p)}
                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-xl border border-blue-200 dark:border-blue-800 transition flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Configure Keys</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleMaintenance(p)}
                    title={p.status === 'MAINTENANCE' ? 'Exit Maintenance' : 'Toggle Maintenance Mode'}
                    className={`p-1.5 rounded-lg text-xs font-bold transition ${
                      p.status === 'MAINTENANCE'
                        ? 'text-emerald-600 hover:bg-emerald-50'
                        : 'text-amber-600 hover:bg-amber-50'
                    }`}
                  >
                    <Sliders className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeletePlatform(p.id, p.name)}
                    title="Delete Platform"
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {p.developerPortalUrl && (
                    <a
                      href={p.developerPortalUrl}
                      target="_blank"
                      rel="noreferrer"
                      title="Open Developer Portal"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Capability Matrix Table */}
      {activeTab === 'CAPABILITY_MATRIX' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">
                Platform Capabilities Configuration Matrix
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Feature permissions enforced across publishing schedulers, validators, and media pipelines.
              </p>
            </div>
            <button
              onClick={() => handleOpenAddModal()}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Platform</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-4 px-4 text-left">Platform</th>
                  <th className="py-4 px-3">Images</th>
                  <th className="py-4 px-3">Video</th>
                  <th className="py-4 px-3">Stories</th>
                  <th className="py-4 px-3">Reels</th>
                  <th className="py-4 px-3">Shorts</th>
                  <th className="py-4 px-3">Scheduling</th>
                  <th className="py-4 px-3">Analytics</th>
                  <th className="py-4 px-3">Comments</th>
                  <th className="py-4 px-3">Deletion</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200">
                {platforms.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 text-left font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                      {p.logoUrl ? (
                        <img src={p.logoUrl} alt={p.name} className="w-4 h-4 object-contain" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                      )}
                      <span>{p.name}</span>
                    </td>
                    <td className="py-3.5 px-3">{p.capabilities.images ? '✅' : '❌'}</td>
                    <td className="py-3.5 px-3">{p.capabilities.video ? '✅' : '❌'}</td>
                    <td className="py-3.5 px-3">{p.capabilities.stories ? '✅' : '❌'}</td>
                    <td className="py-3.5 px-3">{p.capabilities.reels ? '✅' : '❌'}</td>
                    <td className="py-3.5 px-3">{p.capabilities.shorts ? '✅' : '❌'}</td>
                    <td className="py-3.5 px-3">{p.capabilities.scheduling ? '✅' : '❌'}</td>
                    <td className="py-3.5 px-3">{p.capabilities.analytics ? '✅' : '❌'}</td>
                    <td className="py-3.5 px-3">{p.capabilities.comments ? '✅' : '❌'}</td>
                    <td className="py-3.5 px-3">{p.capabilities.deletion ? '✅' : '❌'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🚀 ADD / EDIT PLATFORM & SECRET KEYS MODAL (COMPREHENSIVE)                */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    {editingPlatform ? `Configure ${editingPlatform.name}` : 'Add New Social Platform Integration'}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Enter API credentials, OAuth secrets, callback redirects, and platform capabilities.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSavePlatform} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* 1. Basic Identity */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                  <span>1. Platform Identity & Branding</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Platform Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. TikTok, Bluesky, Snapchat"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Platform Code / Slug *
                    </label>
                    <input
                      type="text"
                      required
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value)}
                      placeholder="e.g. tiktok, bluesky"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Platform Category
                    </label>
                    <input
                      type="text"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      placeholder="e.g. Short-Form Video, Microblog"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Logo / Icon Image URL
                    </label>
                    <input
                      type="url"
                      value={formLogoUrl}
                      onChange={(e) => setFormLogoUrl(e.target.value)}
                      placeholder="https://cdn.simpleicons.org/..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 2. OAuth Credentials & Secret Keys */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                    <span>2. OAuth 2.0 & API Secret Keys</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>AES-256 GCM Encrypted</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Client ID / App ID / API Key *
                    </label>
                    <input
                      type="text"
                      required
                      value={formClientId}
                      onChange={(e) => setFormClientId(e.target.value)}
                      placeholder="Paste Client ID / App ID here"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                        Client Secret / App Secret *
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        {showSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showSecret ? 'Hide' : 'Reveal'}</span>
                      </button>
                    </div>
                    <input
                      type={showSecret ? 'text' : 'password'}
                      required
                      value={formClientSecret}
                      onChange={(e) => setFormClientSecret(e.target.value)}
                      placeholder="Paste Client Secret here"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Auto Generated Redirect Callback URI Display */}
                <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Live OAuth Redirect / Callback URI:</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(calculatedCallbackUrl);
                        setActionMsg('Callback URI copied to clipboard!');
                      }}
                      className="text-xs font-black text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy URI</span>
                    </button>
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 break-all select-all">
                    {calculatedCallbackUrl}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Paste this exact URL into your platform&apos;s Developer App Settings as the Allowed OAuth Redirect URI.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      OAuth Authorization URL
                    </label>
                    <input
                      type="url"
                      value={formAuthUrl}
                      onChange={(e) => setFormAuthUrl(e.target.value)}
                      placeholder="https://platform.com/oauth/authorize"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      OAuth Access Token URL
                    </label>
                    <input
                      type="url"
                      value={formTokenUrl}
                      onChange={(e) => setFormTokenUrl(e.target.value)}
                      placeholder="https://platform.com/oauth/token"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      API Base URL
                    </label>
                    <input
                      type="url"
                      value={formApiBaseUrl}
                      onChange={(e) => setFormApiBaseUrl(e.target.value)}
                      placeholder="https://api.platform.com/v1/"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Required Scopes (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formScopes}
                      onChange={(e) => setFormScopes(e.target.value)}
                      placeholder="read,write,publish_video"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Capabilities Toggles */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                  <span>3. Platform Capability Toggles</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Image Posts', state: capImages, set: setCapImages },
                    { label: 'Video Uploads', state: capVideo, set: setCapVideo },
                    { label: 'Stories', state: capStories, set: setCapStories },
                    { label: 'Reels', state: capReels, set: setCapReels },
                    { label: 'Shorts', state: capShorts, set: setCapShorts },
                    { label: 'Scheduling', state: capScheduling, set: setCapScheduling },
                    { label: 'Analytics Sync', state: capAnalytics, set: setCapAnalytics },
                    { label: 'Comment Sync', state: capComments, set: setCapComments },
                    { label: 'Post Deletion', state: capDeletion, set: setCapDeletion },
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
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* 4. Publishing Limits */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                  <span>4. Publishing Constraints & Status</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Max Caption Length (chars)
                    </label>
                    <input
                      type="number"
                      value={formMaxCaption}
                      onChange={(e) => setFormMaxCaption(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Max Video Size (MB)
                    </label>
                    <input
                      type="number"
                      value={formMaxVideoMB}
                      onChange={(e) => setFormMaxVideoMB(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Platform Status
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100"
                    >
                      <option value="OPERATIONAL">OPERATIONAL (Active)</option>
                      <option value="MAINTENANCE">MAINTENANCE (Paused)</option>
                      <option value="DEGRADED">DEGRADED (Warning)</option>
                      <option value="OUTAGE">OUTAGE (Down)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-lg shadow-blue-600/20 active:scale-98 transition flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{editingPlatform ? 'Save Platform Changes' : 'Activate & Save Platform'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
