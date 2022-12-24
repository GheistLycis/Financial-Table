import BaseDTO from "src/configs/BaseDTO";
import CategoryDTO from "./category";
import MonthlyEntryDTO from "./monthlyEntry";
import YearDTO from "./year";

export default interface MonthDTO extends BaseDTO {
  month: number
  obs?: string
  year: YearDTO
  categories?: CategoryDTO[]
  entries?: MonthlyEntryDTO[]
}