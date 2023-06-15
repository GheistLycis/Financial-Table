import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ip } from './Ip';
import { IpController } from './controller/ip.controller';
import { IpService } from './service/ip.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ip])],
  controllers: [IpController],
  providers: [IpService],
})
export class IpModule {}
