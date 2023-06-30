import MonthDTO from "src/app/month/Month.dto"


export default interface MonthHistory {
  month: MonthDTO
  monthlyIncomes: number
  monthlyExpenses: number
  available: number
  expenses: number
}