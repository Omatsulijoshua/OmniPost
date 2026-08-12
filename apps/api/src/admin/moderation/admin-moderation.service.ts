import { Injectable, NotFoundException } from '@nestjs/common';

export interface AdminSupportTicketItem {
  id: string;
  userEmail: string;
  workspaceName: string;
  subject: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  assignedAdmin: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSupportTicketDetail extends AdminSupportTicketItem {
  messages: Array<{ sender: string; role: 'USER' | 'SUPPORT_ADMIN'; text: string; timestamp: string }>;
}

export interface AdminFlaggedContentItem {
  id: string;
  postId: string;
  postCaption: string;
  userName: string;
  workspaceName: string;
  reason: 'SPAM' | 'HARASSMENT' | 'COPYRIGHT' | 'EXPLICIT_CONTENT' | 'POLICY_VIOLATION';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING_REVIEW' | 'APPROVED' | 'BLOCKED';
  createdAt: string;
}

@Injectable()
export class AdminModerationService {
  private tickets: AdminSupportTicketDetail[] = [
    {
      id: 'tck-401',
      userEmail: 'miles@cyberdyne.com',
      workspaceName: 'Cyberdyne Systems',
      subject: 'Custom Webhook Payload schema validation question',
      priority: 'HIGH',
      status: 'OPEN',
      assignedAdmin: 'Sarah Connor (Support Lead)',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      messages: [
        { sender: 'miles@cyberdyne.com', role: 'USER', text: 'Hi, our custom webhook integration is failing signature verification. Can you check secret keys?', timestamp: new Date(Date.now() - 3600000 * 4).toISOString() },
        { sender: 'Sarah Connor', role: 'SUPPORT_ADMIN', text: 'Hello Miles, I am checking your API key rotation logs right now.', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
      ],
    },
    {
      id: 'tck-402',
      userEmail: 'elena@apexgrowth.io',
      workspaceName: 'Apex Growth Lab',
      subject: 'TikTok Video Upload quota discrepancy',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      assignedAdmin: 'Alex Rivers',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      messages: [
        { sender: 'elena@apexgrowth.io', role: 'USER', text: 'We reached our 100 video limit for this month, can we request temporary extension?', timestamp: new Date(Date.now() - 86400000).toISOString() },
      ],
    },
  ];

  private flaggedItems: AdminFlaggedContentItem[] = [
    {
      id: 'flg-101',
      postId: 'post-901',
      postCaption: 'WIN $1,000,000 CASH NOW!! Click suspicious link right here http://spam-link.test',
      userName: 'Bot Account 492',
      workspaceName: 'Unverified Free Workspace',
      reason: 'SPAM',
      severity: 'CRITICAL',
      status: 'PENDING_REVIEW',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'flg-102',
      postId: 'post-902',
      postCaption: 'Copyrighted audio soundtrack included in commercial promotional video ad.',
      userName: 'Marcus Vance',
      workspaceName: 'Apex Growth Lab',
      reason: 'COPYRIGHT',
      severity: 'MEDIUM',
      status: 'PENDING_REVIEW',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
  ];

  async listTickets(): Promise<AdminSupportTicketItem[]> {
    return this.tickets.map(({ messages, ...rest }) => rest);
  }

  async getTicketDetail(id: string): Promise<AdminSupportTicketDetail> {
    const t = this.tickets.find((item) => item.id === id);
    if (!t) throw new NotFoundException(`Ticket ${id} not found`);
    return t;
  }

  async replyTicket(id: string, message: string) {
    const t = await this.getTicketDetail(id);
    t.messages.push({
      sender: 'Platform Admin',
      role: 'SUPPORT_ADMIN',
      text: message,
      timestamp: new Date().toISOString(),
    });
    t.status = 'IN_PROGRESS';
    t.updatedAt = new Date().toISOString();
    return t;
  }

  async listFlaggedContent(): Promise<AdminFlaggedContentItem[]> {
    return this.flaggedItems;
  }

  async enforceModerationAction(flagId: string, action: 'APPROVE' | 'BLOCK' | 'WARN_USER' | 'SUSPEND_WORKSPACE') {
    const item = this.flaggedItems.find((f) => f.id === flagId);
    if (!item) throw new NotFoundException(`Flagged content ${flagId} not found`);
    item.status = action === 'APPROVE' ? 'APPROVED' : 'BLOCKED';
    return {
      success: true,
      flagId,
      action,
      enforcedAt: new Date().toISOString(),
    };
  }
}
