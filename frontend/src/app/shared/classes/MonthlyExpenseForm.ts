import MonthDTO from "../DTOs/month"

export default class MonthlyExpenseForm {
  value: number
  date?: Date
  description: string
  month: MonthDTO['id']
}