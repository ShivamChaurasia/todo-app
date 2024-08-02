import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS to allow specific origins and methods
  app.enableCors({
    origin: '*', // Allow all domains
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Allow all methods
    allowedHeaders: '*', // Allow all headers
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
