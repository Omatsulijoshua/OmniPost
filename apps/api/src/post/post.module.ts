import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PlatformValidatorService } from './platform-validator.service';

@Module({
  controllers: [PostController],
  providers: [PostService, PlatformValidatorService],
  exports: [PostService, PlatformValidatorService],
})
export class PostModule {}
