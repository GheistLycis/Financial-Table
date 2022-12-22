import { Injectable } from '@nestjs/common';
import { dataSource } from './database/data-source';
import { Year } from './entities/Year';

@Injectable()
export class AppService {
  repo = dataSource.getRepository(Year)

  async list() {
    const result = await this.repo.find()

    return result
  }
}
