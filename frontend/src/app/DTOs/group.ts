import BaseDTO from "../utils/interfaces/BaseDTO";
import CategoryDTO from "./category";
import ExpenseDTO from "./expense";

export default interface GroupDTO extends BaseDTO {
  name: string
  color: string
  category: CategoryDTO
  expenses: ExpenseDTO[]
}