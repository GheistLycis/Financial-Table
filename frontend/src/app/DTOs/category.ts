import BaseDTO from "../utils/interfaces/BaseDTO";
import MonthDTO from "./month";

export default interface CategoryDTO extends BaseDTO {
  name: string
  color: string
  percentage: number
  month: MonthDTO
}