import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, RelationOptions, UpdateDateColumn } from "typeorm"

export default class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date
}

export const manyToOneOptions: RelationOptions = {
  onDelete: 'CASCADE',
}

export const OneToManyOptions: RelationOptions = {
  cascade: true,
}