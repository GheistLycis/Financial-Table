import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  
  async generateToken(userId: string, userName: string): Promise<string> {
    return await this.jwtService.signAsync({ sub: userId, name: userName })
  }
  
  async verifyToken(token: string): Promise<{ sub: string, name: string, iat: number, exp: number }> {
    return await this.jwtService.verifyAsync(token, { secret: process.env.JWT })
  }
}
