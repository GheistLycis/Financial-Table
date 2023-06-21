import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  
  async generateToken(userId: string): Promise<string> {
    return await this.jwtService.signAsync({ sub: userId })
  }
  
  async verifyToken(token: string): Promise<{ iat: number, exp: number, sub: string }> {
    return await this.jwtService.verifyAsync(token, { secret: process.env.JWT })
  }
}
