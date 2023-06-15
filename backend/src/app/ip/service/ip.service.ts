import { Injectable } from '@nestjs/common';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { BaseService } from 'src/shared/BaseService';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/utils/exceptions';
import { Repository } from 'typeorm';
import { Ip } from '../Ip';
import IpDTO from '../Ip.dto';

type body = { ip: string, active: boolean }

@Injectable()
export class IpService implements BaseService<IpDTO> {
  constructor(
    @Repo(Ip) private readonly repo: Repository<Ip>,
  ) {}

  async list() {
    const query = this.repo
      .createQueryBuilder('Ip')
      .orderBy('Ip.createdAt', 'DESC')

    const entities = await query.getMany()

    return entities.map(row => Ip.toDTO(row))
  }

  async get(id) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Nenhum ip encontrado.')

    return Ip.toDTO(entity)
  }

  async post({ ip }: body) {
    const repeated = await this.repo.createQueryBuilder('Ip')
      .where('Ip.ip = :ip', { ip })
      .getOne()
    if(repeated) throw DuplicatedException('Este ip já foi cadastrado.')
    
    const entity = this.repo.create({
      ip, 
      active: true,
    })

    const errors = await validate(entity)
    if(errors.length != 0) throw classValidatorError(errors)
      
    await this.repo.save(entity)

    return Ip.toDTO(entity)
  }

  async put(id, { active }: body) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Ip não encontrado.')

    entity.active = active

    const errors = await validate(entity)
    if(errors.length != 0) throw classValidatorError(errors)

    await this.repo.save(entity)

    return Ip.toDTO(entity)
  }

  async delete(id) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Ip não encontrado.')

    await this.repo.softRemove(entity)

    return Ip.toDTO(entity)
  }
}
