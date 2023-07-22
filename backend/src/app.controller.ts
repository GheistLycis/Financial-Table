import { Controller, Get } from '@nestjs/common';
import BypassIpGuard from './shared/decorators/BypassIpGuard';
import BypassTokenGuard from './shared/decorators/BypassTokenGuard';

@Controller()
export class AppController {

    @Get('health-check')
    @BypassTokenGuard()
    @BypassIpGuard()
    async healthCheck() {
        return { message: 'Up and running!', data: null }
    }
}
