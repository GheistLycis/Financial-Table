import { Service } from "typedi";
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { IsInt, Max, Min } from 'class-validator';
import { BaseEntity, manyToOneOptions, OneToManyOptions } from "src/database/BaseEntity";
import { Category } from "./Category";
import MonthDTO from "src/DTOs/month";
import { Year } from "./Year";

@Service()
@Entity("months")
export class Month extends BaseEntity {
  // COLUMNS
  @Column()
  @IsInt()
  @Min(1)
  @Max(12)
  month: number

  // RELATIONS
  @ManyToOne(() => Year, year => year.months, manyToOneOptions)
  year: Year

  @OneToMany(() => Category, category => category.month, OneToManyOptions)
  categories: Category[]

  public static toDTO(row: Month): MonthDTO {
    return {
      month: row.month,
      year: Year.toDTO(row.year),
      categories: row.categories ? row.categories.map(category => Category.toDTO(category)) : null,
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}