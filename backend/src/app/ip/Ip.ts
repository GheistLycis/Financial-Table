import { Service } from "typedi";
import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToMany,
  JoinTable,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";
import IpDTO from "./Ip.dto";
import { User } from "../user/User";
import { manyToManyOptions } from "src/shared/classes/BaseEntity";

@Service()
@Entity({ name: 'ips', orderBy: { createdAt: 'DESC' }})
export class Ip  {
  // COLUMNS
  @PrimaryColumn()
  ip: string

  @Column({ default: false })
  active: boolean
  
  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
  
  // RELATIONS
  @ManyToMany(() => User, manyToManyOptions)
  @JoinTable()
  users: User[]

  static toDTO(row: Ip): IpDTO {
    return {
      ip: row.ip,
      active: row.active,
      users: row.users ? row.users.map(user => User.toDTO(user)) : null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}