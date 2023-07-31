import { MonthNames } from "../enums/MonthNames"

export default interface ExpenseChartData {
    labels: string[]
    datasets: { 
        data: number[]
        label: keyof typeof MonthNames
    }[]
}