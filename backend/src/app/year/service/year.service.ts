import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import BaseService from 'src/shared/interfaces/BaseService';
import YearDTO from '../Year.dto';
import { Year } from '../Year';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/shared/functions/globalExceptions';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

type body = { year: number }

@Injectable()
export class YearService implements BaseService<YearDTO> {
  constructor(
    @Repo(Year) private repo: Repository<Year>,
  ) {}

  async list() {    
    const query = this.repo.createQueryBuilder('Year')
      .orderBy('Year.year', 'DESC')

    return await query.getMany().then(entities => entities.map(row => Year.toDTO(row)))
  }

  async get(id: YearDTO['id']) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Nenhum ano encontrado.')

    return Year.toDTO(entity)
  }

  async post({ year }: body) {
    const repeated = await this.repo.findOneBy({ year })
    if(repeated) throw DuplicatedException('Este ano já foi cadastrado.')
    
    const entity = this.repo.create({ year })

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)
      
    await this.repo.save(entity)

    return Year.toDTO(entity)
  }

  async put(id: YearDTO['id'], { year }: body) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Ano não encontrado.')

    const repeated = await this.repo.createQueryBuilder('Year')
      .where('Year.id != :id', { id })
      .andWhere('Year.year = :year', { year })
      .getOne()
    if(repeated) throw DuplicatedException('Este ano já foi cadastrado.')

    entity.year = year

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)

    await this.repo.save(entity)

    return Year.toDTO(entity)
  }

  async delete(id: YearDTO['id']) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Ano não encontrado.')

    await this.repo.softRemove(entity)

    return Year.toDTO(entity)
  }
}
