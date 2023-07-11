import BaseDTO from "src/shared/interfaces/BaseDTO";
import UserDTO from "../user/User.dto";
import { savingStatus } from "./Saving";

export default interface SavingDTO extends BaseDTO {
  title: string
  description: string
  amount: number
  dueDate?: Date
  status: savingStatus
  user: UserDTO
}