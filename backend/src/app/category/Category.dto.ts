import BaseDTO from "src/shared/BaseDTO";
import GroupDTO from "../group/Group.dto";
import MonthDTO from "../month/Month.dto";

export default interface CategoryDTO extends BaseDTO {
  name: string
  color: string
  percentage: number
  month: MonthDTO
  groups?: GroupDTO[]
}