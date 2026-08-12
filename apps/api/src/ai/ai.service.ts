import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MockAIProvider } from '@omnipost/ai-core';
import {
  AICaptionAdaptResult,
  ContentAuditResult,
  BestTimeRecommendation,
  PlatformType,
  ToneOption,
  AIJobSummary,
} from '@omnipost/types';
import {
  AdaptCaptionInput,
  GenerateHashtagsInput,
  ScoreContentInput,
  RepurposeContentInput,
  GenerateImagePromptInput,
} from '@omnipost/validation';

@Injectable()
export class AIService {
  private readonly provider = new MockAIProvider();

  constructor(private readonly prisma: PrismaService) {}

  async adaptCaption(
    workspaceId: string,
    input: AdaptCaptionInput,
  ): Promise<AICaptionAdaptResult> {
    const res = await this.provider.adaptCaption(
      input.caption,
      input.platformType,
      input.tone,
    );

    await this.prisma.aIJob.create({
      data: {
        workspaceId,
        type: 'CAPTION_ADAPTATION',
        status: 'COMPLETED',
        input: JSON.parse(JSON.stringify(input)),
        output: JSON.parse(JSON.stringify(res)),
      },
    });

    return {
      platformType: input.platformType as PlatformType,
      adaptedCaption: res.adaptedCaption,
      tone: input.tone as ToneOption,
      hashtags: res.hashtags,
    };
  }

  async generateHashtags(
    workspaceId: string,
    input: GenerateHashtagsInput,
  ): Promise<string[]> {
    const res = await this.provider.adaptCaption(
      input.topic,
      input.platformType,
      'Viral',
    );

    await this.prisma.aIJob.create({
      data: {
        workspaceId,
        type: 'HASHTAG_GENERATION',
        status: 'COMPLETED',
        input: JSON.parse(JSON.stringify(input)),
        output: JSON.parse(JSON.stringify(res.hashtags)),
      },
    });

    return res.hashtags;
  }

  async scoreContent(
    workspaceId: string,
    input: ScoreContentInput,
  ): Promise<ContentAuditResult> {
    const res = await this.provider.calculateContentScore(
      input.caption,
      input.platformType,
    );

    await this.prisma.aIJob.create({
      data: {
        workspaceId,
        type: 'CONTENT_SCORE',
        status: 'COMPLETED',
        input: JSON.parse(JSON.stringify(input)),
        output: JSON.parse(JSON.stringify(res)),
      },
    });

    return res;
  }

  async recommendBestPostingTime(
    platformType: PlatformType,
    timezone = 'UTC',
  ): Promise<BestTimeRecommendation> {
    const res = await this.provider.recommendBestPostingTime(platformType, timezone);
    return {
      platformType,
      bestDay: res.bestDay,
      bestHour: res.bestHour,
      timezone,
      confidenceScore: res.confidenceScore,
    };
  }

  async repurposeContent(
    workspaceId: string,
    input: RepurposeContentInput,
  ): Promise<Record<string, string>> {
    const res = await this.provider.repurposeText(
      input.sourceText,
      input.targetPlatforms,
    );

    await this.prisma.aIJob.create({
      data: {
        workspaceId,
        type: 'REPURPOSE',
        status: 'COMPLETED',
        input: JSON.parse(JSON.stringify(input)),
        output: JSON.parse(JSON.stringify(res)),
      },
    });

    return res;
  }

  async generateImagePrompt(
    workspaceId: string,
    input: GenerateImagePromptInput,
  ): Promise<string> {
    const prompt = await this.provider.generateImagePrompt(
      input.concept,
      input.style,
    );

    await this.prisma.aIJob.create({
      data: {
        workspaceId,
        type: 'IMAGE_PROMPT',
        status: 'COMPLETED',
        input: JSON.parse(JSON.stringify(input)),
        output: JSON.parse(JSON.stringify({ prompt })),
      },
    });

    return prompt;
  }

  async getHistory(workspaceId: string): Promise<AIJobSummary[]> {
    const jobs = await this.prisma.aIJob.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return jobs.map((j) => ({
      id: j.id,
      workspaceId: j.workspaceId,
      type: j.type,
      status: j.status,
      createdAt: j.createdAt.toISOString(),
    }));
  }
}
