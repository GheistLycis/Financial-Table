import BaseDTO from "src/common/BaseDTO";
import CategoryDTO from "../category/Category.dto";
import MonthlyEntryDTO from "../monthly-entry/MonthlyEntry.dto";
import YearDTO from "../year/Year.dto";

export default interface MonthDTO extends BaseDTO {
  month: number
  obs?: string
  year: YearDTO
  categories?: CategoryDTO[]
  entries?: MonthlyEntryDTO[]
}