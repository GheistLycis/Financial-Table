import MonthDTO from "../DTOs/month"

export default class MonthlyIncomeForm {
  value: number
  date?: Date
  description: string
  month: MonthDTO['id']
}