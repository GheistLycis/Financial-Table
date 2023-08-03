import CategoryDTO from "../DTOs/category"
import { MonthNames } from "../enums/MonthNames"


export interface RawCategoryChartData {
    categories: { 
        name: CategoryDTO['name'],
        color: CategoryDTO['color'] 
    }[]
    datasets: { 
        data: number[]
        label: keyof typeof MonthNames
    }[]
}

export interface CategoryChartData {
    labels: CategoryDTO['name'][]
    datasets: { 
        data: number[]
        label: keyof typeof MonthNames
        backgroundColor: CategoryDTO['color'][]
        borderColor: CategoryDTO['color'][]
    }[]
}