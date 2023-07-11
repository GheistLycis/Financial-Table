import { Service } from "typedi";
import {
  Entity,
  Column,
  ManyToOne,
} from "typeorm";
import BaseEntity, { manyToOneOptions } from "src/shared/classes/BaseEntity";
import { User } from "../user/User";
import { Min } from "class-validator";
import DecimalTransformer from "src/shared/classes/DecimalTransformer";
import SavingDTO from "./Saving.dto";


export type savingStatus = 'active' | 'completed' | 'canceled'

@Service()
@Entity({ name: 'savings', orderBy: { createdAt: 'DESC' }})
export class Saving extends BaseEntity  {
  // COLUMNS
  @Column()
  title: string

  @Column({ nullable: true, default: '' })
  description: string
  
  @Column({ type: 'decimal', scale: 2, transformer: new DecimalTransformer() })
  @Min(1)
  amount: number
  
  @Column({ type: 'date', nullable: true })
  dueDate: Date

  @Column({ type: 'enum', enum: ['active', 'completed', 'canceled'], default: 'active' })
  status: savingStatus

  // RELATIONS
  @ManyToOne(() => User, user => user.savings, manyToOneOptions)
  user: User

  static toDTO(row: Saving): SavingDTO {
    return {
      title: row.title,
      description: row.description,
      amount: row.amount,
      dueDate: row.dueDate,
      status: row.status,
      user: row.user ? User.toDTO(row.user) : null,
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}