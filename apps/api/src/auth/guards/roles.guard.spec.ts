import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const mockPrismaService = {
    workspaceMember: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector, mockPrismaService as any);
    jest.clearAllMocks();
  });

  const createMockContext = (headers: Record<string, string>, user?: any): ExecutionContext => {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          headers,
          user,
          params: {},
          query: {},
        }),
      }),
    } as any;
  };

  it('should allow access if no roles are required', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const context = createMockContext({});
    const canActivate = await guard.canActivate(context);
    expect(canActivate).toBe(true);
  });

  it('should throw ForbiddenException if user is missing', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);
    const context = createMockContext({ 'x-workspace-id': 'ws-1' }, undefined);
    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('should allow access if user has sufficient role level (OWNER for ADMIN requirement)', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);
    mockPrismaService.workspaceMember.findUnique.mockResolvedValue({
      id: 'm-1',
      role: { name: 'OWNER' },
    });

    const context = createMockContext({ 'x-workspace-id': 'ws-1' }, { id: 'user-1' });
    const canActivate = await guard.canActivate(context);
    expect(canActivate).toBe(true);
  });

  it('should reject access if user role is insufficient (VIEWER for ADMIN requirement)', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);
    mockPrismaService.workspaceMember.findUnique.mockResolvedValue({
      id: 'm-1',
      role: { name: 'VIEWER' },
    });

    const context = createMockContext({ 'x-workspace-id': 'ws-1' }, { id: 'user-2' });
    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });
});
