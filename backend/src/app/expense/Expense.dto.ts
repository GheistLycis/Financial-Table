import BaseDTO from "src/shared/interfaces/BaseDTO";
import TagDTO from "../tag/Tag.dto";
import CategoryDTO from "../category/Category.dto";

export default interface ExpenseDTO extends BaseDTO {
  value: number
  description: string
  date: Date
  category: CategoryDTO
  tags: TagDTO[]
}