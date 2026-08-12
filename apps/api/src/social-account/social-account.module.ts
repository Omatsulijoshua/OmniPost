import { Module } from '@nestjs/common';
import { SocialAccountService } from './social-account.service';
import { SocialAccountController } from './social-account.controller';
import { CryptoService } from './crypto.service';

@Module({
  controllers: [SocialAccountController],
  providers: [SocialAccountService, CryptoService],
  exports: [SocialAccountService, CryptoService],
})
export class SocialAccountModule {}
