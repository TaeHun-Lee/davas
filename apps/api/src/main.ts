import 'reflect-metadata';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configureHttpSecurity, validateProductionConfiguration } from './common/app-security';
import { configureHttpServerTimeouts } from './common/http-server-timeouts';
import { shouldEnableSwagger } from './common/swagger-config';

async function bootstrap() {
  validateProductionConfiguration();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  configureHttpSecurity(app);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const uploadsDir = process.env.UPLOADS_DIR ?? join(process.cwd(), 'uploads');
  mkdirSync(uploadsDir, { recursive: true });
  app.useStaticAssets(uploadsDir, { prefix: '/uploads/' });

  if (shouldEnableSwagger()) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Davas API')
      .setDescription('Davas backend API')
      .setVersion('0.1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = Number(process.env.PORT ?? 4000);
  const server = await app.listen(port, '0.0.0.0');
  configureHttpServerTimeouts(server);
  console.log(`Davas API listening on http://localhost:${port}/api`);
}

void bootstrap();
