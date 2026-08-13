import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BrandEngine } from '@omnipost/brand-core';
import { BrandKitDetail, ContentTemplateDetail } from '@omnipost/types';
import {
  CreateContentTemplateInput,
  UpdateBrandKitInput,
} from '@omnipost/validation';

@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService) {}

  async getBrandKit(workspaceId: string): Promise<BrandKitDetail> {
    let kit = await this.prisma.brandKit.findFirst({
      where: { workspaceId },
    });

    if (!kit) {
      kit = await this.prisma.brandKit.create({
        data: {
          workspaceId,
          name: 'Default Brand Kit',
          primaryColor: '#6366f1',
          secondaryColor: '#a855f7',
          fontFamily: 'Inter',
          defaultCta: 'Visit our website to learn more!',
          defaultHashtags: ['#OmniPost', '#Growth'],
          voiceTone: 'Professional',
        },
      });
    }

    return {
      id: kit.id,
      workspaceId: kit.workspaceId,
      name: kit.name,
      logoUrl: kit.logoUrl,
      primaryColor: kit.primaryColor,
      secondaryColor: kit.secondaryColor,
      fontFamily: kit.fontFamily,
      watermarkUrl: kit.watermarkUrl,
      defaultCta: kit.defaultCta,
      defaultHashtags: kit.defaultHashtags,
      voiceTone: kit.voiceTone,
      createdAt: kit.createdAt.toISOString(),
      updatedAt: kit.updatedAt.toISOString(),
    };
  }

  async updateBrandKit(
    workspaceId: string,
    input: UpdateBrandKitInput,
  ): Promise<BrandKitDetail> {
    const kit = await this.getBrandKit(workspaceId);

    const updated = await this.prisma.brandKit.update({
      where: { id: kit.id },
      data: {
        name: input.name ?? kit.name,
        logoUrl: input.logoUrl !== undefined ? input.logoUrl : kit.logoUrl,
        primaryColor: input.primaryColor ?? kit.primaryColor,
        secondaryColor: input.secondaryColor ?? kit.secondaryColor,
        fontFamily: input.fontFamily ?? kit.fontFamily,
        watermarkUrl: input.watermarkUrl !== undefined ? input.watermarkUrl : kit.watermarkUrl,
        defaultCta: input.defaultCta ?? kit.defaultCta,
        defaultHashtags: input.defaultHashtags ?? kit.defaultHashtags,
        voiceTone: input.voiceTone ?? kit.voiceTone,
      },
    });

    return {
      id: updated.id,
      workspaceId: updated.workspaceId,
      name: updated.name,
      logoUrl: updated.logoUrl,
      primaryColor: updated.primaryColor,
      secondaryColor: updated.secondaryColor,
      fontFamily: updated.fontFamily,
      watermarkUrl: updated.watermarkUrl,
      defaultCta: updated.defaultCta,
      defaultHashtags: updated.defaultHashtags,
      voiceTone: updated.voiceTone,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async getTemplates(workspaceId: string): Promise<ContentTemplateDetail[]> {
    const customTemplates = await this.prisma.contentTemplate.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    });

    const premade = BrandEngine.getPremadeTemplates().map((t: any, idx: number) => ({
      id: `premade-${idx}`,
      workspaceId: null,
      name: t.name,
      category: t.category,
      templateData: t.templateData as any,
      isGlobal: true,
      createdAt: new Date().toISOString(),
    }));

    const custom = customTemplates.map((t: any) => ({
      id: t.id,
      workspaceId: t.workspaceId,
      name: t.name,
      category: t.category,
      templateData: t.templateData as any,
      isGlobal: false,
      createdAt: t.createdAt.toISOString(),
    }));

    return [...custom, ...premade];
  }

  async createTemplate(
    workspaceId: string,
    input: CreateContentTemplateInput,
  ): Promise<ContentTemplateDetail> {
    const template = await this.prisma.contentTemplate.create({
      data: {
        workspaceId,
        name: input.name,
        category: input.category,
        templateData: {
          caption: input.caption,
          recommendedPlatforms: input.recommendedPlatforms,
          suggestedTone: input.suggestedTone,
        },
        isGlobal: false,
      },
    });

    return {
      id: template.id,
      workspaceId: template.workspaceId,
      name: template.name,
      category: template.category,
      templateData: template.templateData as any,
      isGlobal: false,
      createdAt: template.createdAt.toISOString(),
    };
  }

  async deleteTemplate(workspaceId: string, templateId: string): Promise<boolean> {
    const template = await this.prisma.contentTemplate.findFirst({
      where: { id: templateId, workspaceId },
    });

    if (!template) throw new NotFoundException('Template not found');

    await this.prisma.contentTemplate.delete({
      where: { id: templateId },
    });

    return true;
  }
}
