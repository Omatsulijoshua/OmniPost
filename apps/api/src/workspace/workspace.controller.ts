import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  createWorkspaceSchema,
  addWorkspaceMemberSchema,
  updateWorkspaceMemberRoleSchema,
} from '@omnipost/validation';
import { ApiResponse } from '@omnipost/types';

@Controller('workspaces')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  async createWorkspace(
    @CurrentUser('id') userId: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const parsed = createWorkspaceSchema.parse(body);
    const result = await this.workspaceService.createWorkspace(userId, parsed);
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  async getUserWorkspaces(@CurrentUser('id') userId: string): Promise<ApiResponse> {
    const workspaces = await this.workspaceService.getUserWorkspaces(userId);
    return {
      success: true,
      data: workspaces,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  async getWorkspaceById(
    @Param('id') workspaceId: string,
    @CurrentUser('id') userId: string,
  ): Promise<ApiResponse> {
    const workspace = await this.workspaceService.getWorkspaceById(workspaceId, userId);
    return {
      success: true,
      data: workspace,
      timestamp: new Date().toISOString(),
    };
  }

  @Roles('OWNER', 'ADMIN')
  @Post(':workspaceId/members')
  async addWorkspaceMember(
    @Param('workspaceId') workspaceId: string,
    @CurrentUser('id') actorId: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const parsed = addWorkspaceMemberSchema.parse(body);
    const member = await this.workspaceService.addWorkspaceMember(workspaceId, actorId, parsed);
    return {
      success: true,
      data: member,
      timestamp: new Date().toISOString(),
    };
  }

  @Roles('OWNER', 'ADMIN')
  @Patch(':workspaceId/members/:memberId')
  async updateMemberRole(
    @Param('workspaceId') workspaceId: string,
    @Param('memberId') memberId: string,
    @CurrentUser('id') actorId: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const parsed = updateWorkspaceMemberRoleSchema.parse(body);
    const updated = await this.workspaceService.updateMemberRole(
      workspaceId,
      actorId,
      memberId,
      parsed,
    );
    return {
      success: true,
      data: updated,
      timestamp: new Date().toISOString(),
    };
  }

  @Roles('OWNER', 'ADMIN')
  @Delete(':workspaceId/members/:memberId')
  async removeMember(
    @Param('workspaceId') workspaceId: string,
    @Param('memberId') memberId: string,
    @CurrentUser('id') actorId: string,
  ): Promise<ApiResponse> {
    const result = await this.workspaceService.removeMember(workspaceId, actorId, memberId);
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }
}
