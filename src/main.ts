import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // DTO validatsiyasi uchun
  app.useGlobalPipes(new ValidationPipe());

  // CORS sozlash
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://aaa1-bay.vercel.app',
      'https://tegstop-real.vercel.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 👉 images papkasini public qilish
  app.use('/images', express.static(join(__dirname, '..', 'images')));

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Fraudster API')
    .setDescription('Firibgarlarni boshqarish uchun API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
