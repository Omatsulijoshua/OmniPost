import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceService } from './workspace.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';

describe('WorkspaceService', () => {
  let service: WorkspaceService;

  const mockPrismaService = {
    workspace: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    role: {
      findUniqueOrThrow: jest.fn().mockResolvedValue({ id: 'role-owner', name: 'OWNER' }),
      findUnique: jest.fn(),
    },
    workspaceMember: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspaceService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<WorkspaceService>(WorkspaceService);
    jest.clearAllMocks();
  });

  it('should create a workspace and assign user as OWNER', async () => {
    mockPrismaService.workspace.findUnique.mockResolvedValue(null);
    mockPrismaService.workspace.create.mockResolvedValue({
      id: 'ws-new',
      name: 'Agency Workspace',
      slug: 'agency-ws',
      createdAt: new Date(),
    });

    const result = await service.createWorkspace('user-1', {
      name: 'Agency Workspace',
      slug: 'agency-ws',
    });

    expect(result.id).toBe('ws-new');
    expect(result.role).toBe('OWNER');
  });

  it('should throw ConflictException when slug is taken', async () => {
    mockPrismaService.workspace.findUnique.mockResolvedValue({ id: 'ws-existing' });

    await expect(
      service.createWorkspace('user-1', {
        name: 'Agency Workspace',
        slug: 'agency-ws',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should add a workspace member', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue({ id: 'user-invited', email: 'editor@omnipost.io', name: 'Editor' });
    mockPrismaService.workspaceMember.findUnique.mockResolvedValue(null);
    mockPrismaService.role.findUnique.mockResolvedValue({ id: 'role-editor', name: 'EDITOR' });
    mockPrismaService.workspaceMember.create.mockResolvedValue({
      id: 'member-1',
      workspaceId: 'ws-1',
      userId: 'user-invited',
      role: { name: 'EDITOR' },
      user: { id: 'user-invited', email: 'editor@omnipost.io', name: 'Editor', avatarUrl: null },
      createdAt: new Date(),
    });

    const result = await service.addWorkspaceMember('ws-1', 'owner-id', {
      email: 'editor@omnipost.io',
      role: 'EDITOR',
    });

    expect(result.role).toBe('EDITOR');
    expect(result.user.email).toBe('editor@omnipost.io');
  });

  it('should prevent removing the workspace OWNER', async () => {
    mockPrismaService.workspaceMember.findUnique.mockResolvedValue({
      id: 'owner-member-id',
      workspaceId: 'ws-1',
      role: { name: 'OWNER' },
    });

    await expect(
      service.removeMember('ws-1', 'actor-id', 'owner-member-id'),
    ).rejects.toThrow(ForbiddenException);
  });
});
