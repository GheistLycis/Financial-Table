import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { IpService } from 'src/app/ip/service/ip.service';
import { handleException } from 'src/shared/functions/globalHandlers';
import { ForbiddenException } from 'src/shared/functions/globalExceptions';

@Injectable()
export class IpGuard implements CanActivate {
  constructor(@Inject(IpService) private ipService: IpService) { }
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>()
    const res = context.switchToHttp().getResponse<Response>()
    const { ip } = req

    return await this.ipService.get(ip)
      .then(({ active }) => {
          if(active) return true
          else throw handleException(req, res, ForbiddenException('IP não autorizado.'))
        }, () => {
          throw handleException(req, res, ForbiddenException('IP desconhecido.'))
        })
  }
}
