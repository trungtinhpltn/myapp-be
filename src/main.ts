import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.enableCors({
    origin: '*',
  });
  // app.enableCors({
  //   origin: 'domain',
  //   credentials: true,
  // });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('POS API')
      .setDescription('API description POS')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
  if (process.env.NODE_ENV !== 'production') {
    const appUrl = await app.getUrl();
    console.log('\n-------------------------------------------------------');
    console.log(`🚀 Server is running on: ${appUrl}`);
    console.log(`📚 Swagger UI docs:     ${appUrl}/api/docs`);
    console.log('-------------------------------------------------------\n');
  }
}
await bootstrap();
