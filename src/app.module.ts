import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedditModule } from './reddit/reddit.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [RedditModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
