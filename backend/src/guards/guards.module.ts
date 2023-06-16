import { Module } from '@nestjs/common';
import { IpModule } from 'src/app/ip/ip.module';

@Module({
    imports: [IpModule],
})
export class GuardsModule {}