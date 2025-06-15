import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app
    .listen(envs.PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${envs.PORT}`);
    })
    .catch((err) => {
      console.error('❌ Failed to start the app:', err);
      process.exit(1);
    });
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start the app:', err);
  process.exit(1);
});
