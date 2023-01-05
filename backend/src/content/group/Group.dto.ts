import BaseDTO from "src/common/BaseDTO";
import CategoryDTO from "../category/Category.dto";
import ExpenseDTO from "../expense/Expense.dto";

export default interface GroupDTO extends BaseDTO {
  name: string
  color: string
  category: CategoryDTO
  expenses?: ExpenseDTO[]
}