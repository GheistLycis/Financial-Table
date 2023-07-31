import CategoryDTO from "src/app/category/Category.dto"

export default interface CategoryChartData {
    labels: CategoryDTO['name'][]
    datasets: { 
        data: number[]
        label: string
        backgroundColor: CategoryDTO['color'][]
        borderColor: CategoryDTO['color'][]
    }[]
}