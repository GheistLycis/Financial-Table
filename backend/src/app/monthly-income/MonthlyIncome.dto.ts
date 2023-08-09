import BaseDTO from "@interfaces/BaseDTO";
import MonthDTO from "../month/Month.dto";

export default interface MonthlyIncomeDTO extends BaseDTO {
  value: number
  date?: Date
  description?: string
  month: MonthDTO
}