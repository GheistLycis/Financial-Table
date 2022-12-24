import BaseDTO from "src/configs/BaseDTO";
import GroupDTO from "./group";
import MonthDTO from "./month";

export default interface CategoryDTO extends BaseDTO {
  name: string
  color: string
  percentage: number
  month: MonthDTO
  groups?: GroupDTO[]
}