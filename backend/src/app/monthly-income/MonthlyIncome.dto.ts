import BaseDTO from "src/shared/interfaces/BaseDTO";
import MonthDTO from "../month/Month.dto";

export default interface MonthlyIncomeDTO extends BaseDTO {
  value: number
  description?: string
  month: MonthDTO
}