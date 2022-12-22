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
import CategoryDTO from "src/DTOs/category";
import { manyToOneOptions, OneToManyOptions } from "src/DTOs/baseDTO";
import { Group } from "./Group";
import { Month } from "./Month";

@Service()
@Entity("categories")
export class Category  {
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