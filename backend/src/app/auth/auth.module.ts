import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/service/user.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, UserService],
  exports: [AuthService]
})
export class AuthModule {}
