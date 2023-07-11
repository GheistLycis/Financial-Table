import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/app/auth/service/auth.service';
import { UnauthorizedException } from 'src/filters/globalExceptions';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    @Inject(AuthService) private authService: AuthService,
    private reflector: Reflector,
  ) { }
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if(this.reflector.get('bypassTokenGuard', context.getHandler())) return true

    const req = context.switchToHttp().getRequest<Request>()
    const { authorization='' } = req.headers
    const [ tokenType, token ] = authorization.split(' ')
    
    if(tokenType != 'Bearer' || !token) throw UnauthorizedException('Sem autenticação.')
    
    return await this.authService.verifyToken(token)
      .then(({ sub }) => {
          req['user'] = { id: sub }
          
          return true
        }, () => {
          throw UnauthorizedException('Token inválido.')
        })
  }
}
