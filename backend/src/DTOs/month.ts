import BaseDTO from "src/database/BaseDTO";
import CategoryDTO from "./category";
import YearDTO from "./year";

export default interface MonthDTO extends BaseDTO {
  month: number
  year: YearDTO
  categories?: CategoryDTO[]
}