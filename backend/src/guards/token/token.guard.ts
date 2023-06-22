import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/app/auth/service/auth.service';
import { handleException } from 'src/shared/functions/GlobalHandlers';
import { UnauthorizedException } from 'src/shared/functions/globalExceptions';
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
    const res = context.switchToHttp().getResponse<Response>()
    const { authorization='' } = req.headers
    const [ tokenType, token ] = authorization.split(' ')
    
    if(tokenType != 'Bearer' || !token) throw handleException(req, res, UnauthorizedException('Sem autenticação.')) 
    
    return await this.authService.verifyToken(token)
      .then(({ sub }) => {
          req['user'] = { id: sub }
          
          return true
        }, () => {
          throw handleException(req, res, UnauthorizedException('Token inválido.'))
        })
  }
}
