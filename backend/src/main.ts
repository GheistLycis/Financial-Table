import "dotenv/config";
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
    .then(app => app.setGlobalPrefix('api'))

  const config = new DocumentBuilder().build()
  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('/s', app, document)

  app.listen(process.env.SERVER_PORT)
}

bootstrap()