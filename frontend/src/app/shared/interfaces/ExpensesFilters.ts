import CategoryDTO from "@DTOs/category";
import MonthDTO from "@DTOs/month";
import TagDTO from "@DTOs/tag";

export default interface ExpensesFilters {
  months: MonthDTO[]
  categories: CategoryDTO[]
  tags: TagDTO[]
}