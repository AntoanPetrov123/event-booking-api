import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const url = configService.get<string>('APP_URL');
  const port = configService.get<string>('PORT') || 3000;

  app.enableCors({
    origin: url,
    credentials: true,
  });

  await app.listen(port);
}

bootstrap();
