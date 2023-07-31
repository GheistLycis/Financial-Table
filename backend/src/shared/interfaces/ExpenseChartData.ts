import CategoryDTO from "src/app/category/Category.dto"

export default interface ExpenseChartData {
    labels: CategoryDTO['name'][]
    datasets: { 
        data: number[]
        label: string
        backgroundColor: CategoryDTO['color'][]
    }[]
}