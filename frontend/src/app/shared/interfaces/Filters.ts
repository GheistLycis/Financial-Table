import CategoryDTO from "src/app/shared/DTOs/category";
import GroupDTO from "src/app/shared/DTOs/group";
import MonthDTO from "src/app/shared/DTOs/month";

export default interface Filters {
  months: MonthDTO[],
  categories: CategoryDTO[],
  groups: GroupDTO[],
}