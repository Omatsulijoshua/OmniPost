import { Test, TestingModule } from '@nestjs/testing';
import { AdminUsersService } from './admin-users.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AdminUsersService', () => {
  let service: AdminUsersService;

  const mockPrismaService = {
    user: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminUsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AdminUsersService>(AdminUsersService);
    jest.clearAllMocks();
  });

  it('should list users with pagination metadata', async () => {
    mockPrismaService.user.count.mockResolvedValue(2);
    mockPrismaService.user.findMany.mockResolvedValue([
      {
        id: 'usr-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'CREATOR',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const res = await service.listUsers({ page: 1, limit: 10 });

    expect(res.items.length).toBeGreaterThan(0);
    expect(res.pagination.total).toBe(2);
  });

  it('should fetch user detail profile', async () => {
    const user = await service.getUserDetail('usr-1001');

    expect(user.id).toBe('usr-1001');
    expect(user.workspaces.length).toBeGreaterThan(0);
    expect(user.usage.postsPublished).toBeGreaterThan(0);
  });

  it('should suspend user and return updated status', async () => {
    const res = await service.suspendUser('usr-1001', 'Abuse report');

    expect(res.status).toBe('SUSPENDED');
    expect(res.reason).toBe('Abuse report');
  });
});
