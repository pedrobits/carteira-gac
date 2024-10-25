import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Carteira GAC - Documentation')
    .setDescription('API for managing users and transactions, including registration, JWT authentication, balance transfer, and transaction reversal.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Configurações adicionais
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.use(cors());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
