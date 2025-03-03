import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import process from 'node:process';

import { type INestApplication, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  type SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

import { AppModule } from './app.module';
import { IS_PROD, PORT } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.enableCors();

  initSwagger(app);

  await app.listen(PORT);
}

function initSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Movie Management System API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const options: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      deepLinking: true,
      docExpansion: 'none',
      tagsSorter: 'alpha',
      filter: true,
    },
  };

  SwaggerModule.setup('api-docs', app, document, options);
}

async function start() {
  if (!IS_PROD) {
    await bootstrap();
    return;
  }

  const numCPUs = availableParallelism();

  if (cluster.isPrimary) {
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
      console.log(`Worker ${worker.process.pid} died`);
    });

    return;
  }

  console.log(`Worker ${process.pid} started`);

  await bootstrap();
}

void start();
