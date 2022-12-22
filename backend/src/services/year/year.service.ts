import { Injectable } from '@nestjs/common';
import { dataSource } from 'src/database/data-source';
import MonthDTO from 'src/DTOs/month';
import YearDTO from 'src/DTOs/year';
import { Month } from 'src/entities/Month';
import { Year } from 'src/entities/Year';
import { DuplicatedException, NotFoundException } from 'src/utils/exceptions';

export type postBody = { year: string }
export type putBody = { year: string, months: MonthDTO[] }

@Injectable()
export class YearService {
  repo = dataSource.getRepository(Year)
  monthRepo = dataSource.getRepository(Month)

  async list(): Promise<YearDTO[]> {
    const entities = await this.repo.find({ order: { createdAt: 'DESC' }})

    return entities.map(row => Year.toDTO(row))
  }

  async getById(id): Promise<YearDTO> {
    const entity = await this.repo.findOneBy({ id })

    return Year.toDTO(entity)
  }

  async post(body: postBody): Promise<YearDTO> {
    const { year } = body

    const repeated = await this.repo.findOneBy({ year })
    if(repeated) throw DuplicatedException('Este ano já foi cadastrado.')
    
    const entity = this.repo.create({ year })
      
    await this.repo.save(entity)

    return Year.toDTO(entity)
  }

  async put(id, body: putBody): Promise<YearDTO> {
    const { year, months } = body
  
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Ano não encontrado.')

    const monthEntities = await this.monthRepo.createQueryBuilder('Month')
      .where('Month.id IN :ids', { ids: months.map(month => month.id) })
      .getMany()

    entity.year = year
    entity.months = monthEntities

    await this.repo.save(entity)

    return Year.toDTO(entity)
  }

  async delete(id): Promise<YearDTO> {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Ano não encontrado.')

    await this.repo.softRemove(entity)

    return Year.toDTO(entity)
  }
}
