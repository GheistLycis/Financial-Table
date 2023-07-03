import MonthDTO from "../DTOs/month"

export default class CategoryForm {
  name: string
  percentage: number
  color: string
  month: MonthDTO['id']
}