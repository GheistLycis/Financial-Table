import CategoryDTO from "../DTOs/category"
import TagDTO from "../DTOs/tag"

export default class ExpenseForm {
  value: number
  description: string
  date: Date
  category: CategoryDTO['id']
  tags: { id: TagDTO['id'] }[]
}