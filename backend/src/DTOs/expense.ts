import BaseDTO from "./baseDTO";
import GroupDTO from "./group";

export default interface ExpenseDTO extends BaseDTO {
  value: number
  description: string
  date: Date
  group: GroupDTO
}