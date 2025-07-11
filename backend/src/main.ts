import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Prefix all routes with '/api'
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('The nestjs API description')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const swaggerPath = 'docs';

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPath, app, documentFactory);

  const domain = process.env.DOMAIN ?? 'localhost';
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 Server is running on http://${domain}:${port}`);
  console.log(
    `📚 Swagger docs available at http://${domain}:${port}/${swaggerPath}`,
  );
}
bootstrap();
