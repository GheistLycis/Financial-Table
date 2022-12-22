import BaseDTO from "./baseDTO";
import GroupDTO from "./group";
import MonthDTO from "./month";

export default interface CategoryDTO extends BaseDTO {
  name: string
  color: string
  month: MonthDTO
  groups?: GroupDTO[]
}