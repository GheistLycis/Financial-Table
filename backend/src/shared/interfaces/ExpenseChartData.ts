export default interface ExpenseChartData {
    labels: string[]
    datasets: { 
        data: number[]
        label: string
    }[]
}