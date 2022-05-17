import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { PORT } from './environments';
import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NewrelicInterceptor } from './newrelic.interceptor';
import newrelic from 'newrelic';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: PORT
      }
    }
  );
  app.useGlobalInterceptors(new NewrelicInterceptor());
  logger.log('Microservice is listening to ' + PORT);
  await app.listen();
}
bootstrap();
