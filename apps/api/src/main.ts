import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@omnipost/shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 4000;
  await app.listen(port);
  Logger.info(`OmniPost API running on port ${port}`);
}

bootstrap();
