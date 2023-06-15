import BaseDTO from "src/shared/BaseDTO";
import GroupDTO from "../group/Group.dto";

export default interface ExpenseDTO extends BaseDTO {
  value: number
  description: string
  date: Date
  group: GroupDTO
}