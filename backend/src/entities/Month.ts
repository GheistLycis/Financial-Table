import { Service } from "typedi";
import { v4 as uuid } from "uuid";
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { manyToOneOptions, OneToManyOptions } from "src/database/bases";
import { Category } from "./Category";
import MonthDTO from "src/DTOs/month";
import { Year } from "./Year";

@Service()
@Entity("months")
export class Month  {
  // COLUMNS
  @Column()
  month: string

  // RELATIONS
  @ManyToOne(() => Year, year => year.months, manyToOneOptions)
  year: Year

  @OneToMany(() => Category, category => category.month, OneToManyOptions)
  categories: Category[]

  // BASE
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  constructor() {
    if(!this.id) this.id = uuid()
  }

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