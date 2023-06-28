import YearDTO from "../DTOs/year"

export default interface YearHistory {
  year: YearDTO
  available: number
  monthlyIncomes: number
  monthlyExpenses: number
  expenses: number
}