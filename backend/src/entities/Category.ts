import { Service } from "typedi";
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import CategoryDTO from "src/DTOs/category";
import { BaseEntity, manyToOneOptions, OneToManyOptions } from "src/configs/BaseEntity";
import { Group } from "./Group";
import { Month } from "./Month";
import { Max, Min } from "class-validator";

@Service()
@Entity("categories")
export class Category extends BaseEntity  {
  // COLUMNS
  @Column()
  name: string

  @Column()
  color: string

  @Column()
  @Min(0) @Max(100)
  percentage: number

  // RELATIONS
  @ManyToOne(() => Month, month => month.categories, manyToOneOptions)
  month: Month

  @OneToMany(() => Group, group => group.category, OneToManyOptions)
  groups: Group[]

  static toDTO(row: Category): CategoryDTO {
    return {
      name: row.name,
      color: row.color,
      percentage: row.percentage,
      month: Month.toDTO(row.month),
      groups: row.groups ? row.groups.map(group => Group.toDTO(group)) : null,
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}