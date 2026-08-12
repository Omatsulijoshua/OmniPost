import { Test, TestingModule } from '@nestjs/testing';
import { ApprovalService } from './approval.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ApprovalService', () => {
  let service: ApprovalService;

  const mockPrismaService = {
    post: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    approvalRequest: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    approvalAction: {
      create: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    caption: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApprovalService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ApprovalService>(ApprovalService);
    jest.clearAllMocks();
  });

  it('should submit post draft for approval and log audit event', async () => {
    mockPrismaService.post.findFirst.mockResolvedValue({
      id: 'post-1',
      title: 'Campaign Launch',
      universalCaption: 'Join our campaign',
      author: { name: 'Alice Author' },
    });

    mockPrismaService.approvalRequest.create.mockResolvedValue({
      id: 'app-req-1',
      postId: 'post-1',
      createdAt: new Date(),
    });

    const res = await service.submitForApproval('ws-1', 'user-1', 'post-1');

    expect(res.id).toBe('app-req-1');
    expect(res.status).toBe('PENDING');
    expect(mockPrismaService.post.update).toHaveBeenCalledWith({
      where: { id: 'post-1' },
      data: { status: 'PROCESSING' },
    });
    expect(mockPrismaService.auditLog.create).toHaveBeenCalled();
  });

  it('should approve request and update post status to SCHEDULED', async () => {
    mockPrismaService.approvalRequest.findUnique.mockResolvedValue({
      id: 'app-req-1',
      postId: 'post-1',
      post: {
        id: 'post-1',
        title: 'Campaign Launch',
        universalCaption: 'Join our campaign',
        author: { name: 'Alice Author' },
      },
      createdAt: new Date(),
    });

    const res = await service.actionApproval('ws-1', 'admin-1', 'app-req-1', {
      action: 'APPROVE',
      comment: 'Looks great!',
    });

    expect(res.status).toBe('APPROVED');
    expect(mockPrismaService.post.update).toHaveBeenCalledWith({
      where: { id: 'post-1' },
      data: { status: 'SCHEDULED' },
    });
  });
});
