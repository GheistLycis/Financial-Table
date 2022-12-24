import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { BaseService } from 'src/configs/BaseService';
import { dataSource } from 'src/configs/data-source';
import YearDTO from 'src/DTOs/year';
import { Year } from 'src/entities/Year';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/utils/exceptions';

export type body = { year: string }

@Injectable()
export class YearService implements BaseService<Year, YearDTO> {
  repo = dataSource.getRepository(Year)

  async list() {
    const entities = await this.repo.find({ order: { createdAt: 'DESC' }})

    return entities.map(row => Year.toDTO(row))
  }

  async get(id) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Nenhum ano encontrado.')

    return Year.toDTO(entity)
  }

  async post({ year }: body) {
    const repeated = await this.repo.findOneBy({ year })
    if(repeated) throw DuplicatedException('Este ano já foi cadastrado.')
    
    const entity = this.repo.create({ year })

    const errors = await validate(entity)
    if(errors.length != 0) throw classValidatorError(errors)
      
    await this.repo.save(entity)

    return Year.toDTO(entity)
  }

  async put(id, { year }: body) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Ano não encontrado.')

    entity.year = year

    const errors = await validate(entity)
    if(errors.length != 0) throw classValidatorError(errors)

    await this.repo.save(entity)

    return Year.toDTO(entity)
  }

  async delete(id) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Ano não encontrado.')

    await this.repo.softRemove(entity)

    return Year.toDTO(entity)
  }
}
