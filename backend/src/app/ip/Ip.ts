import { Service } from "typedi";
import {
  Entity,
  Column,
} from "typeorm";
import IpDTO from "./Ip.dto";
import BaseEntity from "src/shared/classes/BaseEntity";

@Service()
@Entity("ips")
export class Ip extends BaseEntity  {
  // COLUMNS
  @Column()
  ip: string

  @Column()
  active: boolean

  static toDTO(row: Ip): IpDTO {
    return {
      ip: row.ip,
      active: row.active,
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}