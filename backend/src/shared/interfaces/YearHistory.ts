import YearDTO from "src/app/year/Year.dto"

export default interface YearHistory {
  year: YearDTO
  available: number
  monthlyIncomes: number
  monthlyExpenses: number
  expenses: number
}