import BaseDTO from "../database/bases";
import CategoryDTO from "./category";
import ExpenseDTO from "./expense";

export default interface GroupDTO extends BaseDTO {
  name: string
  color: string
  category: CategoryDTO
  expenses?: ExpenseDTO[]
}