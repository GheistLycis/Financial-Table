import { Service } from "typedi";
import { Entity, Column } from "typeorm";
import BaseEntity from "src/shared/classes/BaseEntity";
import UserDTO from "./User.dto";

@Service()
@Entity({ name: 'users', orderBy: { name: 'ASC' }})
export class User extends BaseEntity {
  // COLUMNS
  @Column()
  name: string
  
  @Column({ unique: true })
  email: string

  @Column()
  password: string

  static toDTO(row: User): UserDTO {
    return {
      name: row.name,
      email: row.email,
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}