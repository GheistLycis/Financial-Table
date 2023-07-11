import { savingStatus } from "../DTOs/SavingDTO"
import UserDTO from "../DTOs/user"

export default class SavingForm {
  title: string
  description: string
  amount: number
  dueDate?: Date
  status: savingStatus
  user: UserDTO['id']
}