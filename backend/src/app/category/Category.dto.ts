import BaseDTO from "@interfaces/BaseDTO";
import MonthDTO from "../month/Month.dto";

export default interface CategoryDTO extends BaseDTO {
  name: string
  color: string
  percentage: number
  month: MonthDTO
}