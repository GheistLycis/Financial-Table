import BaseDTO from "../interfaces/BaseDTO";
import CategoryDTO from "./category";
import TagDTO from "./tag";

export default interface ExpenseDTO extends BaseDTO {
  value: number
  description: string
  date: Date
  category: CategoryDTO
  tags: TagDTO[]
}