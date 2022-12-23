import { Service } from "typedi";
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import CategoryDTO from "src/DTOs/category";
import { BaseEntity, manyToOneOptions, OneToManyOptions } from "src/database/BaseEntity";
import { Group } from "./Group";
import { Month } from "./Month";

@Service()
@Entity("categories")
export class Category extends BaseEntity  {
  // COLUMNS
  @Column()
  name: string

  @Column()
  color: string

  // RELATIONS
  @ManyToOne(() => Month, month => month.categories, manyToOneOptions)
  month: Month

  @OneToMany(() => Group, group => group.category, OneToManyOptions)
  groups: Group[]

  public static toDTO(row: Category): CategoryDTO {
    return {
      name: row.name,
      color: row.color,
      month: Month.toDTO(row.month),
      groups: row.groups ? row.groups.map(group => Group.toDTO(group)) : null,
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}