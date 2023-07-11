import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import BaseService from 'src/shared/interfaces/BaseService';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/filters/globalExceptions';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import TagDTO from '../Tag.dto';
import { Tag } from '../Tag';

type body = { name: string, color: string }

@Injectable()
export class TagService implements BaseService<TagDTO> {
  constructor(
    @Repo(Tag) private repo: Repository<Tag>,
  ) {}

  async list() {
    const query = this.repo.createQueryBuilder('Tag')

    return await query.getMany().then(entities => entities.map(row => Tag.toDTO(row)))
  }

  async get(id: TagDTO['id']) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Nenhuma tag encontrada.')

    return Tag.toDTO(entity)
  }

  async post({ name, color }: body) {
    const repeated = await this.repo.createQueryBuilder('Tag')
      .where('Tag.name = :name', { name })
      .getOne()
    if(repeated) throw DuplicatedException('Esta tag já foi cadastrada.')
    
    const entity = this.repo.create({ 
      name, 
      color,
    })
      
    await this.repo.save(entity)

    return Tag.toDTO(entity)
  }

  async put(id: TagDTO['id'], { name, color }: body) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Grupo não encontrado.')

    const repeated = await this.repo.createQueryBuilder('Tag')
      .where('Tag.id != :id', { id })
      .andWhere('Tag.name = :name', { name })
      .getOne()
    if(repeated) throw DuplicatedException('Esta tag já foi cadastrada.')

    entity.name = name
    entity.color = color

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)

    await this.repo.save(entity)

    return Tag.toDTO(entity)
  }

  async delete(id: TagDTO['id']) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Tag não encontrada.')

    await this.repo.softRemove(entity)

    return Tag.toDTO(entity)
  }
}
