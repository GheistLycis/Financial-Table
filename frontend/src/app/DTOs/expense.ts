import BaseDTO from "../utils/interfaces/BaseDTO";
import GroupDTO from "./group";

export default interface ExpenseDTO extends BaseDTO {
  value: number
  description: string
  date: Date
  group: GroupDTO
}