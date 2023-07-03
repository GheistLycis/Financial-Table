import MonthDTO from "../DTOs/month"

export default class MonthlyExpenseForm {
  value: number
  description: string
  month: MonthDTO['id']
}