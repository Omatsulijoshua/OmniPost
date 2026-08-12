import { Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';

export interface AdminAuditLogItem {
  id: string;
  adminName: string;
  adminEmail: string;
  role: string;
  action: string;
  category: 'AUTH' | 'USER_MANAGEMENT' | 'WORKSPACE' | 'BILLING' | 'MODERATION' | 'SYSTEM_SETTING';
  targetResource: string;
  ipAddress: string;
  userAgent: string;
  status: 'SUCCESS' | 'FAILED' | 'REJECTED';
  createdAt: string;
}

export interface AdminAuditLogDetail extends AdminAuditLogItem {
  beforeState: Record<string, any>;
  afterState: Record<string, any>;
  cryptographicHash: string;
  isHashValid: boolean;
}

@Injectable()
export class AdminAuditLogsService {
  private logs: AdminAuditLogDetail[] = [
    {
      id: 'aud-7001',
      adminName: 'Super Admin',
      adminEmail: 'admin@omnipost.com',
      role: 'SUPER_ADMIN',
      action: 'USER_SUSPEND',
      category: 'USER_MANAGEMENT',
      targetResource: 'User: user-102 (john.badactor@test.com)',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'SUCCESS',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      beforeState: { status: 'ACTIVE', suspendedAt: null, reason: null },
      afterState: { status: 'SUSPENDED', suspendedAt: new Date().toISOString(), reason: 'Repeated spam policy violations' },
      cryptographicHash: crypto.createHash('sha256').update('aud-7001-USER_SUSPEND-SUCCESS').digest('hex'),
      isHashValid: true,
    },
    {
      id: 'aud-7002',
      adminName: 'Finance Admin',
      adminEmail: 'finance@omnipost.com',
      role: 'FINANCE_ADMIN',
      action: 'PAYMENT_REFUND',
      category: 'BILLING',
      targetResource: 'Transaction: tx-9001 ($299.00)',
      ipAddress: '10.0.4.12',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      status: 'SUCCESS',
      createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      beforeState: { paymentStatus: 'SUCCEEDED', refunded: false },
      afterState: { paymentStatus: 'REFUNDED', refunded: true, refundReason: 'Duplicate billing inquiry' },
      cryptographicHash: crypto.createHash('sha256').update('aud-7002-PAYMENT_REFUND-SUCCESS').digest('hex'),
      isHashValid: true,
    },
  ];

  async listAuditLogs(): Promise<AdminAuditLogItem[]> {
    return this.logs.map(({ beforeState, afterState, cryptographicHash, isHashValid, ...rest }) => rest);
  }

  async getAuditLogDetail(id: string): Promise<AdminAuditLogDetail> {
    const entry = this.logs.find((l) => l.id === id);
    if (!entry) throw new NotFoundException(`Audit log ${id} not found`);
    return entry;
  }
}
