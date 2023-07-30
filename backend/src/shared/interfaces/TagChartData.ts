import TagDTO from "src/app/tag/Tag.dto"

export default interface TagChartData {
    labels: TagDTO['name'][]
    datasets: { 
        data: number[]
        label: string
        backgroundColor: TagDTO['color'][]
    }[]
}