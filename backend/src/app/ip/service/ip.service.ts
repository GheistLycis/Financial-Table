import { Injectable } from '@nestjs/common';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import BaseService from 'src/shared/interfaces/BaseService';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/shared/functions/globalExceptions';
import { Repository } from 'typeorm';
import { Ip } from '../Ip';
import IpDTO from '../Ip.dto';

type body = { ip: string, active: boolean }

@Injectable()
export class IpService implements BaseService<IpDTO> {
  constructor(
    @Repo(Ip) private repo: Repository<Ip>,
  ) {}

  async list() {
    const query = this.repo
      .createQueryBuilder('Ip')
      .orderBy('Ip.createdAt', 'DESC')

    return await query.getMany().then(entities => entities.map(row => Ip.toDTO(row)))
  }

  async get(ip: string) {
    const entity = await this.repo.findOneBy({ ip })
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
      active: false,
    })

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)
      
    await this.repo.save(entity)

    return Ip.toDTO(entity)
  }

  async put(id: string, { active }: body) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Ip não encontrado.')

    entity.active = active

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)

    await this.repo.save(entity)

    return Ip.toDTO(entity)
  }

  async delete(id: string) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Ip não encontrado.')

    await this.repo.softRemove(entity)

    return Ip.toDTO(entity)
  }
}
