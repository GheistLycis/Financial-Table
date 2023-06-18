import { Service } from "typedi";
import { Entity, Column } from "typeorm";
import { BaseEntity } from "src/shared/BaseEntity";
import UserDTO from "./User.dto";

@Service()
@Entity("users")
export class User extends BaseEntity {
  // COLUMNS
  @Column()
  name: string

  @Column({ nullable: true, default: '' })
  password: string

  static toDTO(row: User): UserDTO {
    return {
      name: row.name,
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}