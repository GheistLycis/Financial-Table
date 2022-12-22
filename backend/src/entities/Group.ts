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
import { Expense } from "./Expense";
import GroupDTO from "src/DTOs/group";
import { manyToOneOptions, OneToManyOptions } from "src/database/bases";
import { Category } from "./Category";

@Service()
@Entity("groups")
export class Group  {
  // COLUMNS
  @Column()
  name: string

  @Column()
  color: string

  // RELATIONS
  @ManyToOne(() => Category, category => category.groups, manyToOneOptions)
  category: Category

  @OneToMany(() => Expense, expense => expense.group, OneToManyOptions)
  expenses: Expense[]

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

  public static toDTO(row: Group): GroupDTO {
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