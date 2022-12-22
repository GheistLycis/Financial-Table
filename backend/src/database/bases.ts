import { RelationOptions } from "typeorm"

export default interface BaseDTO {
  id: string
  createdAt: Date
  updatedAt: Date
}

export const manyToOneOptions: RelationOptions = {
  onDelete: 'CASCADE',
  cascade: true,
  eager: true,
}

export const OneToManyOptions: RelationOptions = {
  nullable: true,
}