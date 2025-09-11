import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // DTO validatsiyasi uchun
  app.useGlobalPipes(new ValidationPipe());

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

  // Swagger hujjatini yaratish
  const document = SwaggerModule.createDocument(app, config);

  // Swagger UI ni sozlash
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
