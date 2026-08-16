import { Injectable, NotFoundException } from '@nestjs/common';

export interface AdminSecurityPolicy {
  allowedAdminIps: string[];
  sessionInactivityTimeoutMinutes: number;
  enforceMfaForAllAdmins: boolean;
  cspHeaderEnforced: boolean;
  corsAllowedAdminOrigins: string[];
}

export interface AdminActiveSession {
  id: string;
  adminName: string;
  adminEmail: string;
  role: string;
  ipAddress: string;
  location: string;
  device: string;
  loginAt: string;
  lastActiveAt: string;
}

export interface SecurityThreatTelemetry {
  bruteForceBlocks24h: number;
  failedMfaAttempts24h: number;
  suspiciousIpAlerts: number;
  activeAdminSessionsCount: number;
}

@Injectable()
export class AdminSecurityService {
  private policies: AdminSecurityPolicy = {
    allowedAdminIps: ['192.168.1.0/24', '10.0.0.0/16'],
    sessionInactivityTimeoutMinutes: 30,
    enforceMfaForAllAdmins: true,
    corsAllowedAdminOrigins: [
      'https://omnipost-admin.vercel.app',
      'https://omnipost-web-ivory.vercel.app',
      'http://localhost:3000',
      'http://localhost:3002',
      'https://admin.omnipost.com',
    ],

  private sessions: AdminActiveSession[] = [
    {
      id: 'sess-901',
      adminName: 'Super Admin',
      adminEmail: 'admin@omnipost.com',
      role: 'SUPER_ADMIN',
      ipAddress: '192.168.1.100',
      location: 'San Francisco, US',
      device: 'Chrome 128 (Windows 11)',
      loginAt: new Date(Date.now() - 7200000).toISOString(),
      lastActiveAt: new Date().toISOString(),
    },
    {
      id: 'sess-902',
      adminName: 'Alex Rivers',
      adminEmail: 'alex@omnipost.com',
      role: 'OPERATIONS_ADMIN',
      ipAddress: '10.0.4.15',
      location: 'London, UK',
      device: 'Firefox 130 (macOS)',
      loginAt: new Date(Date.now() - 14400000).toISOString(),
      lastActiveAt: new Date(Date.now() - 1800000).toISOString(),
    },
  ];

  async getPolicies(): Promise<AdminSecurityPolicy> {
    return this.policies;
  }

  async updatePolicies(update: Partial<AdminSecurityPolicy>): Promise<AdminSecurityPolicy> {
    Object.assign(this.policies, update);
    return this.policies;
  }

  async listActiveSessions(): Promise<AdminActiveSession[]> {
    return this.sessions;
  }

  async revokeSession(id: string) {
    const idx = this.sessions.findIndex((s) => s.id === id);
    if (idx === -1) throw new NotFoundException(`Session ${id} not found`);
    const removed = this.sessions.splice(idx, 1)[0];
    return {
      success: true,
      sessionId: id,
      revokedAt: new Date().toISOString(),
    };
  }

  async getThreatTelemetry(): Promise<SecurityThreatTelemetry> {
    return {
      bruteForceBlocks24h: 142,
      failedMfaAttempts24h: 8,
      suspiciousIpAlerts: 2,
      activeAdminSessionsCount: this.sessions.length,
    };
  }
}
