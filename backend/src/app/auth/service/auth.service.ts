import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import UserDTO from 'src/app/user/User.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  
  async generateToken(userId: UserDTO['id']): Promise<string> {
    return await this.jwtService.signAsync({ sub: userId })
  }
  
  async verifyToken(token: string): Promise<{ iat: number, exp: number, sub: UserDTO['id'] }> {
    return await this.jwtService.verifyAsync(token, { secret: process.env.JWT })
  }
}
