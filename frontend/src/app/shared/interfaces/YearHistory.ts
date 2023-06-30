import YearDTO from "../DTOs/year"

export default interface YearHistory {
  year: YearDTO
  monthlyIncomes: number
  monthlyExpenses: number
  available: number
  expenses: number
}