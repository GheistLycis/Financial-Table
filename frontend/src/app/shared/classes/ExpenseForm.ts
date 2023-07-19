import CategoryDTO from "../DTOs/category"
import TagDTO from "../DTOs/tag"

export default class ExpenseForm {
  value: number
  description: string
  date: Date | string
  category: CategoryDTO['id']
  tags: TagDTO[]
}