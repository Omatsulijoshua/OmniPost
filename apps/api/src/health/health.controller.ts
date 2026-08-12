import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@omnipost/types';

@Controller('health')
export class HealthController {
  @Get()
  checkHealth(): ApiResponse<{ status: string; service: string }> {
    return {
      success: true,
      data: {
        status: 'ok',
        service: 'OmniPost API',
      },
      timestamp: new Date().toISOString(),
    };
  }
}
