import CategoryDTO from "src/app/DTOs/category";
import GroupDTO from "src/app/DTOs/group";
import MonthDTO from "src/app/DTOs/month";
import YearDTO from "src/app/DTOs/year";

export default interface TableFilters {
  years: YearDTO[],
  months: MonthDTO[],
  categories: CategoryDTO[],
  groups: GroupDTO[],
}