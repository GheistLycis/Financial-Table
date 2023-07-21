import { Service } from "typedi";
import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from "typeorm";
import ExpenseDTO from "./Expense.dto";
import BaseEntity, { manyToManyOptions, manyToOneOptions } from "../../shared/classes/BaseEntity";
import DecimalTransformer from "src/shared/classes/DecimalTransformer";
import { Min } from "class-validator";
import { Tag } from "../tag/Tag";
import { Category } from "../category/Category";

@Service()
@Entity({ name: 'expenses' })
export class Expense extends BaseEntity  {
  // COLUMNS
  @Column({ type: 'decimal', scale: 2, transformer: new DecimalTransformer() })
  @Min(1)
  value: number

  @Column({ nullable: true, default: '' })
  description: string

  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  date: Date

  // RELATIONS
  @ManyToOne(() => Category, category => category.expenses, manyToOneOptions)
  category: Category
  
  @ManyToMany(() => Tag, manyToManyOptions)
  @JoinTable()
  tags: Tag[]

  static toDTO(row: Expense): ExpenseDTO {
    return {
      value: row.value,
      description: row.description,
      date: row.date,
      category: row.category ? Category.toDTO(row.category) : null,
      tags: row.tags ? row.tags.map(tag => Tag.toDTO(tag)) : null,
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}