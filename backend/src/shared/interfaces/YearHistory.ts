import YearDTO from "src/app/year/Year.dto"

export default interface YearHistory {
  year: YearDTO
  monthlyIncomes: number
  monthlyExpenses: number
  available: number
  expenses: number
  saved: number
}