import { Service } from "typedi";
import { Entity, Column, OneToMany } from "typeorm";
import BaseEntity, { oneToManyOptions } from "src/shared/classes/BaseEntity";
import UserDTO from "./User.dto";
import { Saving } from "../saving/Saving";

@Service()
@Entity({ name: 'users', orderBy: { name: 'ASC' }})
export class User extends BaseEntity {
  // COLUMNS
  @Column()
  name: string
  
  @Column({ unique: true })
  email: string

  @Column()
  password: string
  
  // RELATIONS
  @OneToMany(() => Saving, saving => saving.user, oneToManyOptions)
  savings: Saving[]

  static toDTO(row: User): UserDTO {
    return {
      name: row.name,
      email: row.email,
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}