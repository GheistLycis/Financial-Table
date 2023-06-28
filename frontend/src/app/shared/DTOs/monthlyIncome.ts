import BaseDTO from "../interfaces/BaseDTO";
import MonthDTO from "./month";

export default interface MonthlyIncomeDTO extends BaseDTO {
  value: number
  description: string
  month: MonthDTO
}