import BaseDTO from "../interfaces/BaseDTO";
import MonthDTO from "./month";

export default interface MonthlyExpenseDTO extends BaseDTO {
  value: number
  date?: Date
  description: string
  month: MonthDTO
}