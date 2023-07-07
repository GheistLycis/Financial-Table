import { Service } from "typedi";
import {
  Entity,
  Column,
  OneToMany,
} from "typeorm";
import BaseEntity, { oneToManyOptions } from "src/shared/classes/BaseEntity";
import { Month } from "../month/Month";
import YearDTO from "./Year.dto";

@Service()
@Entity({ name: 'years', orderBy: { year: 'DESC' }})
export class Year extends BaseEntity {
  // COLUMNS
  @Column({ unique: true })
  year: number

  // RELATIONS
  @OneToMany(() => Month, month => month.year, oneToManyOptions)
  months: Month[]

  static toDTO(row: Year): YearDTO {
    return {
      year: row.year,
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}