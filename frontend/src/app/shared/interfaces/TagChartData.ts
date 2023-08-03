import TagDTO from "../DTOs/tag"
import { MonthNames } from "../enums/MonthNames"


export interface RawTagChartData {
    tags: { 
        name: TagDTO['name'],
        color: TagDTO['color'] 
    }[]
    datasets: { 
        data: number[]
        label: keyof typeof MonthNames
    }[]
}

export interface TagChartData {
    labels: TagDTO['name'][]
    datasets: { 
        data: number[]
        label: keyof typeof MonthNames
        backgroundColor: TagDTO['color'][]
        borderColor: TagDTO['color'][]
    }[]
}