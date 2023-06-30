import MonthDTO from "../DTOs/month"

export default interface MonthHistory {
  month: MonthDTO
  monthlyIncomes: number
  monthlyExpenses: number
  available: number
  expenses: number
  balance: number
}