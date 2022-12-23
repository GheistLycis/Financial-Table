import BaseDTO from "src/database/BaseDTO";
import GroupDTO from "./group";

export default interface ExpenseDTO extends BaseDTO {
  value: number
  description: string
  date: Date
  group: GroupDTO
}