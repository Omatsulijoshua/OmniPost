import { Module } from '@nestjs/common';
import { TranscodingService } from './transcoding.service';
import { TranscodingController } from './transcoding.controller';

@Module({
  controllers: [TranscodingController],
  providers: [TranscodingService],
  exports: [TranscodingService],
})
export class TranscodingModule {}
