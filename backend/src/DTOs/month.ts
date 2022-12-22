import BaseDTO from "./baseDTO";
import CategoryDTO from "./category";
import YearDTO from "./year";

export default interface MonthDTO extends BaseDTO {
  month: string
  year: YearDTO
  categories?: CategoryDTO[]
}