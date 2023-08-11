import { Service } from "typedi";
import { Entity, Column, OneToMany } from "typeorm";
import BaseEntity, { oneToManyOptions } from "@classes/BaseEntity";
import UserDTO from "./User.dto";
import { Saving } from "../saving/Saving";
import { Year } from "../year/Year";
import { Tag } from "../tag/Tag";
import { IsEmail } from "class-validator";

@Service()
@Entity({ name: 'users', orderBy: { name: 'ASC' }})
export class User extends BaseEntity {
  // COLUMNS
  @Column()
  name: string
  
  @IsEmail()
  @Column({ unique: true })
  email: string

  @Column()
  password: string
  
  // RELATIONS
  @OneToMany(() => Year, year => year.user, oneToManyOptions)
  years: Year[]
  
  @OneToMany(() => Tag, tag => tag.user, oneToManyOptions)
  tags: Tag[]
  
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