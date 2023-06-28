import BaseDTO from "../interfaces/BaseDTO";
import MonthDTO from "./month";

export default interface MonthlyExpenseDTO extends BaseDTO {
  value: number
  description: string
  month: MonthDTO
}