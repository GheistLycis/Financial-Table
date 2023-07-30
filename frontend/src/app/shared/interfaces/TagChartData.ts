import TagDTO from "../DTOs/tag"
import { MonthNames } from "../enums/MonthNames"

export default interface TagChartData {
    labels: TagDTO['name'][]
    datasets: { 
        data: number[]
        label: keyof typeof MonthNames
        backgroundColor: TagDTO['color'][]
    }[]
}