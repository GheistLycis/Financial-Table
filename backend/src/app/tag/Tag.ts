import { Service } from "typedi";
import {
  Entity,
  Column,
  ManyToOne
} from "typeorm";
import BaseEntity, { manyToOneOptions } from "@classes/BaseEntity";
import IsColor from "@decorators/class-validator/IsColor";
import { Validate } from "class-validator";
import TagDTO from "./Tag.dto";
import { User } from "../user/User";

@Service()
@Entity({ name: 'tags', orderBy: { createdAt: 'DESC' }})
export class Tag extends BaseEntity  {
  // COLUMNS
  @Column()
  name: string

  @Column()
  @Validate(IsColor)
  color: string
  
  // RELATIONS
  @ManyToOne(() => User, user => user.tags, manyToOneOptions)
  user: User

  static toDTO(row: Tag): TagDTO {
    return {
      name: row.name,
      color: row.color,
      user: row.user ? User.toDTO(row.user) : null,
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}