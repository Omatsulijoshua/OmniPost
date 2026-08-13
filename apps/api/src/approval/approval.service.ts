import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ApprovalCommentDetail,
  ApprovalRequestDetail,
  AuditLogItem,
} from '@omnipost/types';
import { ActionApprovalInput, AddCommentInput } from '@omnipost/validation';

@Injectable()
export class ApprovalService {
  constructor(private readonly prisma: PrismaService) {}

  async submitForApproval(
    workspaceId: string,
    userId: string,
    postId: string,
  ): Promise<ApprovalRequestDetail> {
    const post = await this.prisma.post.findFirst({
      where: { id: postId, workspaceId, deletedAt: null },
      include: { author: true },
    });

    if (!post) throw new NotFoundException('Post not found');

    const req = await this.prisma.approvalRequest.create({
      data: {
        postId: post.id,
        status: 'PENDING',
      },
    });

    await this.prisma.post.update({
      where: { id: postId },
      data: { status: 'PROCESSING' },
    });

    await this.prisma.auditLog.create({
      data: {
        workspaceId,
        userId,
        action: 'SUBMIT_FOR_APPROVAL',
        entity: 'POST',
        entityId: postId,
      },
    });

    return {
      id: req.id,
      postId: post.id,
      postTitle: post.title || 'Untitled Post',
      universalCaption: post.universalCaption,
      authorName: post.author.name,
      status: 'PENDING',
      createdAt: req.createdAt.toISOString(),
    };
  }

  async actionApproval(
    workspaceId: string,
    userId: string,
    approvalRequestId: string,
    input: ActionApprovalInput,
  ): Promise<ApprovalRequestDetail> {
    const req = await this.prisma.approvalRequest.findUnique({
      where: { id: approvalRequestId },
      include: { post: { include: { author: true } } },
    });

    if (!req) throw new NotFoundException('Approval request not found');

    const newStatus = input.action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

    await this.prisma.approvalRequest.update({
      where: { id: approvalRequestId },
      data: { status: newStatus },
    });

    await this.prisma.approvalAction.create({
      data: {
        approvalRequestId,
        actorId: userId,
        action: input.action,
        comment: input.comment,
      },
    });

    const targetPostStatus = input.action === 'APPROVE' ? 'SCHEDULED' : 'DRAFT';

    await this.prisma.post.update({
      where: { id: req.postId },
      data: { status: targetPostStatus },
    });

    await this.prisma.auditLog.create({
      data: {
        workspaceId,
        userId,
        action: `APPROVAL_${input.action}`,
        entity: 'POST',
        entityId: req.postId,
      },
    });

    return {
      id: req.id,
      postId: req.post.id,
      postTitle: req.post.title || 'Untitled Post',
      universalCaption: req.post.universalCaption,
      authorName: req.post.author.name,
      status: newStatus as any,
      createdAt: req.createdAt.toISOString(),
    };
  }

  async getPending(workspaceId: string): Promise<ApprovalRequestDetail[]> {
    const requests = await this.prisma.approvalRequest.findMany({
      where: {
        post: { workspaceId, deletedAt: null },
        status: 'PENDING',
      },
      include: {
        post: { include: { author: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return requests.map((req: any) => ({
      id: req.id,
      postId: req.post.id,
      postTitle: req.post.title || 'Untitled Post',
      universalCaption: req.post.universalCaption,
      authorName: req.post.author.name,
      status: 'PENDING',
      createdAt: req.createdAt.toISOString(),
    }));
  }

  async addComment(
    workspaceId: string,
    userId: string,
    input: AddCommentInput,
  ): Promise<ApprovalCommentDetail> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    const caption = await this.prisma.caption.create({
      data: {
        postId: input.postId,
        content: input.content,
        tone: 'INTERNAL_FEEDBACK',
      },
    });

    return {
      id: caption.id,
      postId: input.postId,
      authorName: user?.name || 'Workspace Member',
      content: caption.content,
      createdAt: caption.createdAt.toISOString(),
    };
  }

  async getComments(
    workspaceId: string,
    postId: string,
  ): Promise<ApprovalCommentDetail[]> {
    const comments = await this.prisma.caption.findMany({
      where: { postId, tone: 'INTERNAL_FEEDBACK' },
      orderBy: { createdAt: 'asc' },
    });

    return comments.map((c: any) => ({
      id: c.id,
      postId: c.postId,
      authorName: 'Workspace Member',
      content: c.content,
      createdAt: c.createdAt.toISOString(),
    }));
  }

  async getAuditLogs(workspaceId: string): Promise<AuditLogItem[]> {
    const logs = await this.prisma.auditLog.findMany({
      where: { workspaceId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 25,
    });

    return logs.map((l: any) => ({
      id: l.id,
      actorName: l.user?.name || 'System Worker',
      action: l.action,
      entity: l.entity,
      createdAt: l.createdAt.toISOString(),
    }));
  }

  async exportAuditLogsCsv(workspaceId: string): Promise<string> {
    const logs = await this.getAuditLogs(workspaceId);
    const lines = ['OmniPost Security Audit Trail Log'];
    lines.push(`Generated,${new Date().toISOString()}`);
    lines.push('');
    lines.push('Timestamp,Actor,Action,Entity,Log ID');

    for (const l of logs) {
      lines.push(`${l.createdAt},${l.actorName},${l.action},${l.entity},${l.id}`);
    }

    return lines.join('\n');
  }
}
