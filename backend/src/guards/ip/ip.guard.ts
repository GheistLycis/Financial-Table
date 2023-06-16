import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { IpService } from 'src/app/ip/service/ip.service';

@Injectable()
export class IpGuard implements CanActivate {
  constructor(@Inject(IpService) private readonly ipService: IpService) { }
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { ip } = context.switchToHttp().getRequest<Request>()

    return await this.ipService.get(ip)
      .then(
        ({ active }) => active,
        () => false
      )
  }
}
