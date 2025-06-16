import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateToken(payload: Record<string, any>) {
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
