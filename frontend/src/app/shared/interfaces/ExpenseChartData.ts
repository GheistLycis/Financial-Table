import { MonthNames } from "../enums/MonthNames"

export interface RawExpenseChartData {
    data: number[]
    label: keyof typeof MonthNames
}

export interface ExpenseChartData {
    labels: number[]
    datasets: RawExpenseChartData[]
}