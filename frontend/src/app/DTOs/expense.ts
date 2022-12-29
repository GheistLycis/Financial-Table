import BaseDTO from "./BaseDTO";
import GroupDTO from "./group";

export default interface ExpenseDTO extends BaseDTO {
  value: number
  description: string
  date: Date
  group: GroupDTO
}