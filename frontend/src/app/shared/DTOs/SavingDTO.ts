import BaseDTO from "../interfaces/BaseDTO";
import UserDTO from "./user";

export type savingStatus = 'active' | 'completed' | 'canceled'

export default interface SavingDTO extends BaseDTO {
  title: string
  description: string
  amount: number
  dueDate?: Date
  status: savingStatus
  user: UserDTO
}