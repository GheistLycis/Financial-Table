import { Service } from "typedi";
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import CategoryDTO from "./Category.dto";
import { BaseEntity, manyToOneOptions, OneToManyOptions } from "src/shared/BaseEntity";
import { Group } from "../group/Group";
import { Month } from "../month/Month";
import { Max, Min, Validate } from "class-validator";
import { IsColor } from "src/decorators/class-validator/IsColor";

@Service()
@Entity("categories")
export class Category extends BaseEntity  {
  // COLUMNS
  @Column()
  name: string

  @Column()
  @Validate(IsColor)
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
      month: row.month ? Month.toDTO(row.month) : null,
      groups: row.groups ? row.groups.map(group => Group.toDTO(group)) : null,
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}