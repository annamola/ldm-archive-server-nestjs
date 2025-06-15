import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_static_secret',
      signOptions: { expiresIn: '1h' }, // Optional, used only if you generate tokens
    }),
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
