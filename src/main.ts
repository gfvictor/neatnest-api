import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import type { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const desktopOrigins = (
    configService.get<string>('DESKTOP_TESTING_ORIGIN') ?? ''
  )
    .split(',')
    .filter((url) => url.trim() !== '');
  const mobileOrigins = (
    configService.get<string>('MOBILE_TESTING_ORIGIN') ?? ''
  )
    .split(',')
    .filter((url) => url.trim() !== '');

  const allowedOrigins = [...desktopOrigins, ...mobileOrigins];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server running on port ${process.env.PORT}`);
}

void bootstrap();
