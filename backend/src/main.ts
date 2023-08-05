import "dotenv/config";
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from "./filters/global-exception/global-exception.filter";
import { ResponseHandlerInterceptor } from "./interceptors/response-handler/response-handler.interceptor";

declare const module: any // webpack's hot-reload

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: { origin: ['http://localhost:4200', 'https://fi-nance.onrender.com', 'https://fi-nance.vercel.app'] } })
  const config = new DocumentBuilder().build()
  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('/s', app, document)

  app.setGlobalPrefix('api')
  app.useGlobalFilters(new GlobalExceptionFilter())
  app.useGlobalInterceptors(new ResponseHandlerInterceptor())
  app.listen(process.env.SERVER_PORT)
  
  if(module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}
 
bootstrap()