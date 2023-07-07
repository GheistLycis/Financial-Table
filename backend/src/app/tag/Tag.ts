import { Service } from "typedi";
import {
  Entity,
  Column
} from "typeorm";
import BaseEntity from "src/shared/classes/BaseEntity";
import IsColor from "src/shared/decorators/class-validator/IsColor";
import { Validate } from "class-validator";
import TagDTO from "./Tag.dto";

@Service()
@Entity({ name: 'tags', orderBy: { createdAt: 'DESC' }})
export class Tag extends BaseEntity  {
  // COLUMNS
  @Column()
  name: string

  @Column()
  @Validate(IsColor)
  color: string

  static toDTO(row: Tag): TagDTO {
    return {
      name: row.name,
      color: row.color,
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}