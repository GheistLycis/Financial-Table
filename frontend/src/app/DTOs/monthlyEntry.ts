import BaseDTO from "./BaseDTO";
import MonthDTO from "./month";

export default interface MonthlyEntryDTO extends BaseDTO {
  value: number
  description?: string
  month: MonthDTO
}