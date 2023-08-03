import TagDTO from "src/app/tag/Tag.dto"

export default interface TagChartData {
    tags: { 
        name: TagDTO['name']
        color: TagDTO['color'] 
    }[]
    datasets: { 
        data: number[]
        label: string
    }[]
}