import CategoryDTO from "src/app/category/Category.dto"
import { MonthNames } from "../enums/MonthNames"

export default interface CategoryChartData {
    labels: CategoryDTO['name'][]
    datasets: { 
        data: number[]
        label: keyof typeof MonthNames
        backgroundColor: string[]
    }[]
}