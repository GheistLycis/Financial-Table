import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/app/auth/service/auth.service';
import { handleException } from 'src/shared/GlobalHandlers';
import { UnauthorizedException } from 'src/shared/GlobalExceptions';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(@Inject(AuthService) private readonly authService: AuthService) { }
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>()
    const res = context.switchToHttp().getResponse<Response>()
    const { Authorization } = req.headers
    const [ tokenType, token ] = typeof Authorization == 'string' ? Authorization.split(' ') : []
    
    if(tokenType != 'Bearer' || !token) throw handleException(req, res, UnauthorizedException('Sem autenticação.')) 
    
    return await this.authService.verifyToken(token)
      .then(
        res => {
          req['User'] = res
          
          return true
        },
        () => {
          throw handleException(req, res, UnauthorizedException('Token expirado.'))
        }
      )
  }
}
