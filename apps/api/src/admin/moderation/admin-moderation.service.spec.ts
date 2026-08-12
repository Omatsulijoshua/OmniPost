import { Test, TestingModule } from '@nestjs/testing';
import { AdminModerationService } from './admin-moderation.service';

describe('AdminModerationService', () => {
  let service: AdminModerationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminModerationService],
    }).compile();

    service = module.get<AdminModerationService>(AdminModerationService);
  });

  it('should list open support tickets', async () => {
    const tickets = await service.listTickets();

    expect(tickets.length).toBeGreaterThan(0);
    expect(tickets[0].subject).toBeDefined();
  });

  it('should retrieve ticket detail thread and add reply', async () => {
    const detail = await service.getTicketDetail('tck-401');
    expect(detail.messages.length).toBeGreaterThan(0);

    const updated = await service.replyTicket('tck-401', 'We have resolved your issue.');
    expect(updated.messages.length).toBe(3);
  });

  it('should list flagged content queue and enforce actions', async () => {
    const flagged = await service.listFlaggedContent();
    expect(flagged.length).toBeGreaterThan(0);

    const actionResult = await service.enforceModerationAction('flg-101', 'BLOCK');
    expect(actionResult.action).toBe('BLOCK');
  });
});
