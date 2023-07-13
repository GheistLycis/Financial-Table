import { Service } from "typedi";
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import BaseEntity, { manyToOneOptions, oneToManyOptions } from "src/shared/classes/BaseEntity";
import { Month } from "../month/Month";
import YearDTO from "./Year.dto";
import { User } from "../user/User";

@Service()
@Entity({ name: 'years', orderBy: { year: 'DESC' }})
export class Year extends BaseEntity {
  // COLUMNS
  @Column()
  year: number

  // RELATIONS
  @ManyToOne(() => User, user => user.years, manyToOneOptions)
  user: User
  
  @OneToMany(() => Month, month => month.year, oneToManyOptions)
  months: Month[]

  static toDTO(row: Year): YearDTO {
    return {
      year: row.year,
      user: row.user ? User.toDTO(row.user) : null,
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}