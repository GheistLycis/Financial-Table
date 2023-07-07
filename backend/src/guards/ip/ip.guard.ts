import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { IpService } from 'src/app/ip/service/ip.service';
import { handleException } from 'src/shared/functions/globalHandlers';
import { UnauthorizedException } from 'src/shared/functions/globalExceptions';
import { Reflector } from '@nestjs/core';

@Injectable()
export class IpGuard implements CanActivate {
  constructor(
      @Inject(IpService) private ipService: IpService,
      private reflector: Reflector,
    ) { }
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if(this.reflector.get('bypassIpGuard', context.getHandler())) return true
    
    const req = context.switchToHttp().getRequest<Request>()
    const res = context.switchToHttp().getResponse<Response>()
    const { ip } = req
    const { id } = req['user']

    return await this.ipService.get(ip)
      .then(({ active, users }) => {
          if(!users.find(user => user.id == id)) throw handleException(req, res, UnauthorizedException('Usuário não autorizado para o IP.'))
          else if(!active) throw handleException(req, res, UnauthorizedException('IP não autorizado.'))
          else return true
        }, () => {
          throw handleException(req, res, UnauthorizedException('IP desconhecido.'))
        })
  }
}
