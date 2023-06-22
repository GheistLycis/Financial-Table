import { Service } from "typedi";
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Expense } from "../expense/Expense";
import GroupDTO from "./Group.dto";
import BaseEntity, { manyToOneOptions, OneToManyOptions } from "src/shared/classes/BaseEntity";
import { Category } from "../category/Category";
import IsColor from "src/shared/decorators/class-validator/IsColor";
import { Validate } from "class-validator";

@Service()
@Entity("groups")
export class Group extends BaseEntity  {
  // COLUMNS
  @Column()
  name: string

  @Column()
  @Validate(IsColor)
  color: string

  // RELATIONS
  @ManyToOne(() => Category, category => category.groups, manyToOneOptions)
  category: Category

  @OneToMany(() => Expense, expense => expense.group, OneToManyOptions)
  expenses: Expense[]

  static toDTO(row: Group): GroupDTO {
    return {
      name: row.name,
      color: row.color,
      category: row.category ? Category.toDTO(row.category) : null,
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}