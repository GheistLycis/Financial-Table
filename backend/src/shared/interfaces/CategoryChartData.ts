import CategoryDTO from "src/app/category/Category.dto"

export default interface CategoryChartData {
    categories: { 
        name: CategoryDTO['name']
        color: CategoryDTO['color'] 
    }[]
    datasets: { 
        data: number[]
        label: string
    }[]
}