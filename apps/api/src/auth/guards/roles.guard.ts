import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleName } from '@omnipost/types';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleName[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User is not authenticated');
    }

    const workspaceId =
      request.headers['x-workspace-id'] ||
      request.params?.workspaceId ||
      request.query?.workspaceId;

    if (!workspaceId) {
      throw new ForbiddenException('Workspace ID is required for role validation');
    }

    const membership = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: workspaceId as string,
          userId: user.id,
        },
      },
      include: {
        role: true,
      },
    });

    if (!membership) {
      throw new ForbiddenException('User is not a member of this workspace');
    }

    const userRole = membership.role.name as RoleName;

    // Hierarchy fallback: OWNER > ADMIN > EDITOR > PUBLISHER > ANALYST > VIEWER
    const roleHierarchy: Record<RoleName, number> = {
      OWNER: 100,
      ADMIN: 80,
      EDITOR: 60,
      PUBLISHER: 40,
      ANALYST: 20,
      VIEWER: 10,
    };

    const userLevel = roleHierarchy[userRole] || 0;

    const hasPermission = requiredRoles.some(
      (requiredRole) => userLevel >= (roleHierarchy[requiredRole] || 0),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `Required role (${requiredRoles.join(', ')}) exceeds user permission level (${userRole})`,
      );
    }

    // Attach membership context to request for downstream handlers
    request.workspaceMember = membership;
    return true;
  }
}
