import { Test, TestingModule } from '@nestjs/testing';
import { BrandService } from './brand.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BrandService', () => {
  let service: BrandService;

  const mockPrismaService = {
    brandKit: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    contentTemplate: {
      findMany: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<BrandService>(BrandService);
    jest.clearAllMocks();
  });

  it('should return brand kit or create default if not exists', async () => {
    mockPrismaService.brandKit.findFirst.mockResolvedValue(null);
    mockPrismaService.brandKit.create.mockResolvedValue({
      id: 'kit-1',
      workspaceId: 'ws-1',
      name: 'Default Brand Kit',
      primaryColor: '#6366f1',
      secondaryColor: '#a855f7',
      fontFamily: 'Inter',
      defaultCta: 'Visit our site',
      defaultHashtags: ['#OmniPost'],
      voiceTone: 'Professional',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const kit = await service.getBrandKit('ws-1');

    expect(kit.id).toBe('kit-1');
    expect(kit.primaryColor).toBe('#6366f1');
    expect(mockPrismaService.brandKit.create).toHaveBeenCalled();
  });

  it('should return premade viral templates and custom templates', async () => {
    mockPrismaService.contentTemplate.findMany.mockResolvedValue([
      {
        id: 'cust-1',
        workspaceId: 'ws-1',
        name: 'Custom Team Template',
        category: 'Custom',
        templateData: { caption: 'Custom post text' },
        isGlobal: false,
        createdAt: new Date(),
      },
    ]);

    const templates = await service.getTemplates('ws-1');

    expect(templates.length).toBeGreaterThanOrEqual(6);
    expect(templates.some((t) => t.isGlobal)).toBe(true);
    expect(templates.some((t) => t.id === 'cust-1')).toBe(true);
  });
});
