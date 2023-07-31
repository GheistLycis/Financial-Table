import CategoryDTO from "../DTOs/category"
import { MonthNames } from "../enums/MonthNames"

export default interface ExpenseChartData {
    labels: CategoryDTO['name'][]
    datasets: { 
        data: number[]
        label: keyof typeof MonthNames
        backgroundColor: CategoryDTO['color'][]
    }[]
}