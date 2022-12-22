import "dotenv/config";
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { dataSource } from './database/data-source';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = new DocumentBuilder().build()
  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('/s', app, document)

  dataSource.initialize().then(() => app.listen(process.env.SERVER_PORT))
}

bootstrap()
