import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthService } from 'src/app/auth/service/auth.service';
import { UnauthorizedException } from 'src/utils/exceptions';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(@Inject(AuthService) private readonly authService: AuthService) { }
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const [ type=null, token=null ] = req.headers.Authorization?.split(' ') ?? []
    
    if(type != 'Bearer' || !token) throw UnauthorizedException('meu teste 1')
    
    return await this.authService.verifyToken(token)
      .then(
        res => {
          req.User = res
          
          return true
        },
        () => {
          throw UnauthorizedException('meu teste 2')
        }
      )
  }
}
