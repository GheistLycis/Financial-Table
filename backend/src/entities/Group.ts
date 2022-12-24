import { Service } from "typedi";
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Expense } from "./Expense";
import GroupDTO from "src/DTOs/group";
import { BaseEntity, manyToOneOptions, OneToManyOptions } from "src/configs/BaseEntity";
import { Category } from "./Category";
import { IsColor } from "src/decorators/class-validator/IsColor";
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
      category: Category.toDTO(row.category),
      expenses: row.expenses ? row.expenses.map(expense => Expense.toDTO(expense)) : null,
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}