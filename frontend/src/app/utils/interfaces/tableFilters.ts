import CategoryDTO from "src/app/DTOs/category";
import GroupDTO from "src/app/DTOs/group";
import MonthDTO from "src/app/DTOs/month";

export default interface TableFilters {
  months: MonthDTO[],
  categories: CategoryDTO[],
  groups: GroupDTO[],
}