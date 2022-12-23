import { Injectable } from '@nestjs/common';
import { dataSource } from 'src/database/data-source';
import MonthDTO from 'src/DTOs/month';
import YearDTO from 'src/DTOs/year';
import { Month } from 'src/entities/Month';
import { Year } from 'src/entities/Year';
import { DuplicatedException, NotFoundException } from 'src/utils/exceptions';

export type body = { year: string, months: MonthDTO[] }
export type oneReturn =  Promise<YearDTO>
export type manyReturn =  Promise<YearDTO[]>

@Injectable()
export class YearService {
  repo = dataSource.getRepository(Year)
  monthRepo = dataSource.getRepository(Month)

  async list(): manyReturn {
    const entities = await this.repo.find({ order: { createdAt: 'DESC' }})

    return entities.map(row => Year.toDTO(row))
  }

  async getById(id): oneReturn {
    const entity = await this.repo.findOneBy({ id })

    return Year.toDTO(entity)
  }

  async post(body: body): oneReturn {
    const { year, months } = body

    const repeated = await this.repo.findOneBy({ year })
    if(repeated) throw DuplicatedException('Este ano já foi cadastrado.')

    const monthEntities = await this.monthRepo.createQueryBuilder('Month')
      .where('Month.id IN :ids', { ids: months.map(month => month.id) })
      .getMany()
    
    const entity = this.repo.create({ year, months: monthEntities })
      
    await this.repo.save(entity)

    return Year.toDTO(entity)
  }

  async put(id, body: body): oneReturn {
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

  async delete(id): oneReturn {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Ano não encontrado.')

    await this.repo.softRemove(entity)

    return Year.toDTO(entity)
  }
}
