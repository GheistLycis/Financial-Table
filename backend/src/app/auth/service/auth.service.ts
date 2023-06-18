import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/app/user/service/user.service';

type sessionAuthPayload = { sub: string, userName: string }

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UserService,
  ) {}
  
  async generateToken(userName: string, password?: string): Promise<string> {
    const { id, name } = await this.usersService.get(userName)
    const payload: sessionAuthPayload = { sub: id, userName: name }
    
    return await this.jwtService.signAsync(payload)
  }
  
  async verifyToken(token: string): Promise<sessionAuthPayload> {
    return await this.jwtService.verifyAsync(token, { secret: process.env.JWT })
  }
}
