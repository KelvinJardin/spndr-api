import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { INestApplication } from '@nestjs/common';

const updateOpenApiSpec = async (app: INestApplication) => {
  const openApiFilePath = path.resolve(__dirname, '../../docs/openapi.json');

  const config = new DocumentBuilder()
    .setTitle(process.env.npm_package_name ?? '')
    .setDescription(process.env.npm_package_description ?? '')
    .setVersion(process.env.npm_package_version ?? '')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const openApiSpec = documentFactory();

  // Write OpenAPI spec to file
  await mkdir(path.dirname(openApiFilePath), { recursive: true });
  await writeFile(openApiFilePath, JSON.stringify(openApiSpec, null, 2));

  return openApiSpec;
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  await updateOpenApiSpec(app);

  // Listen on all network interfaces
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

void bootstrap();
