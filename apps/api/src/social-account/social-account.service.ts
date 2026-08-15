import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from './crypto.service';
import {
  SocialAccountDetail,
  OAuthUrlResponse,
  PlatformCapabilities,
  PlatformType,
} from '@omnipost/types';
import { ConnectMockAccountInput, OAuthCallbackInput } from '@omnipost/validation';

@Injectable()
export class SocialAccountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService,
  ) {}

  private async ensurePlatform(platformType: PlatformType) {
    let platform = await this.prisma.platform.findUnique({
      where: { type: platformType },
    });

    if (!platform) {
      platform = await this.prisma.platform.create({
        data: {
          type: platformType,
          name: platformType.charAt(0) + platformType.slice(1).toLowerCase().replace('_', ' '),
          capabilities: {},
        },
      });
    }

    return platform;
  }

  async getAccounts(workspaceId: string): Promise<SocialAccountDetail[]> {
    const accounts = await this.prisma.socialAccount.findMany({
      where: { workspaceId },
      include: {
        platform: true,
        credentials: true,
      },
    });

    return accounts.map((acc: any) => this.mapAccountDetail(acc));
  }

  async getOAuthUrl(platformType: PlatformType): Promise<OAuthUrlResponse> {
    const state = Math.random().toString(36).substring(2, 15);
    const tiktokKey = process.env.TIKTOK_CLIENT_KEY || 'MOCK_CLIENT_KEY';
    const instagramKey = process.env.INSTAGRAM_CLIENT_ID || 'MOCK_CLIENT_ID';
    const googleKey = process.env.GOOGLE_CLIENT_ID || 'MOCK_CLIENT_ID';
    const twitterKey = process.env.X_CLIENT_ID || 'MOCK_CLIENT_ID';

    const authUrls: Record<PlatformType, string> = {
      INSTAGRAM: `https://api.instagram.com/oauth/authorize?client_id=${instagramKey}&redirect_uri=https://omnipost.io/oauth/callback&response_type=code&scope=user_profile,user_media&state=${state}`,
      FACEBOOK: `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.FACEBOOK_CLIENT_ID || 'MOCK_CLIENT_ID'}&redirect_uri=https://omnipost.io/oauth/callback&state=${state}`,
      TIKTOK: `https://www.tiktok.com/v2/auth/authorize/?client_key=${tiktokKey}&response_type=code&scope=user.info.basic,video.publish&redirect_uri=https://omnipost.io/oauth/callback&state=${state}`,
      YOUTUBE: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleKey}&redirect_uri=https://omnipost.io/oauth/callback&response_type=code&scope=https://www.googleapis.com/auth/youtube.upload&state=${state}`,
      X: `https://twitter.com/i/oauth2/authorize?client_id=${twitterKey}&redirect_uri=https://omnipost.io/oauth/callback&response_type=code&scope=tweet.read,tweet.write,users.read&state=${state}`,
      LINKEDIN: `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID || 'MOCK_CLIENT_ID'}&redirect_uri=https://omnipost.io/oauth/callback&state=${state}`,
      THREADS: `https://threads.net/oauth/authorize?client_id=${process.env.THREADS_CLIENT_ID || 'MOCK_CLIENT_ID'}&redirect_uri=https://omnipost.io/oauth/callback&response_type=code&state=${state}`,
      PINTEREST: `https://www.pinterest.com/oauth/?client_id=${process.env.PINTEREST_CLIENT_ID || 'MOCK_CLIENT_ID'}&redirect_uri=https://omnipost.io/oauth/callback&response_type=code&state=${state}`,
      TELEGRAM: `https://telegram.org/auth?bot_id=${process.env.TELEGRAM_BOT_ID || 'MOCK_BOT_ID'}&origin=https://omnipost.io&return_to=https://omnipost.io/oauth/callback`,
      DISCORD: `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID || 'MOCK_CLIENT_ID'}&redirect_uri=https://omnipost.io/oauth/callback&response_type=code&scope=bot&state=${state}`,
      SLACK: `https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID || 'MOCK_CLIENT_ID'}&user_scope=chat:write&state=${state}`,
      REDDIT: `https://www.reddit.com/api/v1/authorize?client_id=${process.env.REDDIT_CLIENT_ID || 'MOCK_CLIENT_ID'}&response_type=code&state=${state}&redirect_uri=https://omnipost.io/oauth/callback&duration=permanent&scope=submit`,
      GOOGLE_BUSINESS: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleKey}&redirect_uri=https://omnipost.io/oauth/callback&response_type=code&scope=https://www.googleapis.com/auth/business.manage&state=${state}`,
      OTHER: `https://omnipost.io/oauth/custom?state=${state}`,
    };

    return {
      authorizationUrl: authUrls[platformType],
      state,
    };
  }

  async handleOAuthCallback(
    workspaceId: string,
    input: OAuthCallbackInput,
  ): Promise<SocialAccountDetail> {
    const platform = await this.ensurePlatform(input.platformType);
    const externalId = `ext-${input.platformType.toLowerCase()}-${Date.now()}`;
    const accountName = `@mock_${input.platformType.toLowerCase()}_creator`;

    const existing = await this.prisma.socialAccount.findFirst({
      where: { workspaceId, platformId: platform.id, externalId },
    });

    if (existing) {
      throw new ConflictException('Account already connected');
    }

    const encryptedToken = this.cryptoService.encrypt(`token_mock_${input.code}`);
    const encryptedSecret = this.cryptoService.encrypt('secret_mock');

    const account = await this.prisma.socialAccount.create({
      data: {
        workspaceId,
        platformId: platform.id,
        accountName,
        externalId,
        isMock: false,
        profileUrl: `https://${input.platformType.toLowerCase()}.com/mock`,
        credentials: {
          create: {
            encryptedToken,
            encryptedSecret,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        },
      },
      include: {
        platform: true,
        credentials: true,
      },
    });

    return this.mapAccountDetail(account);
  }

  async connectMockAccount(
    workspaceId: string,
    input: ConnectMockAccountInput,
  ): Promise<SocialAccountDetail> {
    const platform = await this.ensurePlatform(input.platformType);
    const externalId = `mock-ext-${input.platformType.toLowerCase()}-${Date.now()}`;

    const encryptedToken = this.cryptoService.encrypt('mock_access_token');

    const account = await this.prisma.socialAccount.create({
      data: {
        workspaceId,
        platformId: platform.id,
        accountName: input.accountName,
        externalId,
        isMock: true,
        profileUrl: input.profileUrl || `https://${input.platformType.toLowerCase()}.com/mock`,
        avatarUrl: input.avatarUrl || null,
        credentials: {
          create: {
            encryptedToken,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
        },
      },
      include: {
        platform: true,
        credentials: true,
      },
    });

    return this.mapAccountDetail(account);
  }

  async refreshToken(workspaceId: string, id: string): Promise<SocialAccountDetail> {
    const account = await this.prisma.socialAccount.findFirst({
      where: { id, workspaceId },
      include: { credentials: true, platform: true },
    });

    if (!account) throw new NotFoundException('Social account not found');

    if (account.credentials) {
      const newToken = this.cryptoService.encrypt(`refreshed_token_${Date.now()}`);
      await this.prisma.platformCredential.update({
        where: { id: account.credentials.id },
        data: {
          encryptedToken: newToken,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    }

    const updated = await this.prisma.socialAccount.findUnique({
      where: { id },
      include: { platform: true, credentials: true },
    });

    return this.mapAccountDetail(updated);
  }

  async disconnectAccount(workspaceId: string, id: string): Promise<void> {
    const account = await this.prisma.socialAccount.findFirst({
      where: { id, workspaceId },
    });

    if (!account) throw new NotFoundException('Social account not found');

    await this.prisma.socialAccount.delete({ where: { id } });
  }

  private mapAccountDetail(account: any): SocialAccountDetail {
    return {
      id: account.id,
      workspaceId: account.workspaceId,
      platformType: account.platform.type as PlatformType,
      platformName: account.platform.name,
      accountName: account.accountName,
      externalId: account.externalId,
      profileUrl: account.profileUrl,
      avatarUrl: account.avatarUrl,
      isMock: account.isMock,
      capabilities: (account.platform.capabilities as unknown as PlatformCapabilities) || {
        supportsImages: true,
        supportsVideos: true,
        supportsStories: true,
        supportsShorts: true,
        supportsReels: true,
        supportsScheduling: true,
        supportsDirectPublishing: true,
        supportsAnalytics: true,
        supportsComments: true,
        supportsDeletion: true,
        maxVideoSizeMB: 500,
        maxVideoDurationSeconds: 600,
        supportedAspectRatios: ['16:9', '9:16', '1:1'],
        requiresBusinessAccount: false,
        requiresAppReview: false,
      },
      hasValidCredentials: !!account.credentials,
      expiresAt: account.credentials?.expiresAt
        ? account.credentials.expiresAt.toISOString()
        : null,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    };
  }
}
