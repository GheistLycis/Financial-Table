import GroupDTO from "../DTOs/group"

export default class ExpenseForm {
  value: number
  description: string
  date: Date
  group: GroupDTO['id']
}