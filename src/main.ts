import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.cconst PORT = process.env.PORT || 3000;reate(AppModule);
  await app.listen(PORT);
}
bootstrap();
