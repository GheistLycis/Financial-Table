import { Injectable } from '@nestjs/common';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/filters/globalExceptions';
import { Repository } from 'typeorm';
import { Ip } from '../Ip';
import IpDTO from '../Ip.dto';
import UserDTO from 'src/app/user/User.dto';

type body = { ip: string, active: boolean }

@Injectable()
export class IpService {
  constructor(
    @Repo(Ip) private repo: Repository<Ip>,
  ) {}

  async listByUser(id: UserDTO['id']) {
    const entities = await this.repo.find()
      .then(ips => ips.filter(({ users }) => users.find(user => user.id == id)))

    return entities.map(row => Ip.toDTO(row))
  }

  async get(ip: string) {
    const entity = await this.repo.findOneBy({ ip })
    if(!entity) throw NotFoundException('Nenhum ip encontrado.')

    return Ip.toDTO(entity)
  }

  async post({ ip }: Partial<body>) {
    const duplicated = await this.repo.createQueryBuilder('Ip')
      .where('Ip.ip = :ip', { ip })
      .getOne()
    if(duplicated) throw DuplicatedException('Este ip já existe.')
    
    const entity = this.repo.create({ ip })

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)
      
    await this.repo.save(entity)

    return Ip.toDTO(entity)
  }

  async put(ip: IpDTO['ip'], { active }: body) {
    const entity = await this.repo.findOneBy({ ip })
    if(!entity) throw NotFoundException('Ip não encontrado.')

    entity.active = active

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)

    await this.repo.save(entity)

    return Ip.toDTO(entity)
  }
}
