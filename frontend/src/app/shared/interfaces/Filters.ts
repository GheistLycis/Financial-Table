import CategoryDTO from "src/app/shared/DTOs/category";
import MonthDTO from "src/app/shared/DTOs/month";
import TagDTO from "src/app/shared/DTOs/tag";

export default interface Filters {
  months: MonthDTO[]
  categories: CategoryDTO[]
  tags: TagDTO[]
}