import BaseDTO from "src/shared/interfaces/BaseDTO";
import GroupDTO from "../group/Group.dto";

export default interface ExpenseDTO extends BaseDTO {
  value: number
  description: string
  date: Date
  group: GroupDTO
}