import BaseDTO from "src/interfaces/BaseDTO";
import YearDTO from "../year/Year.dto";

export default interface MonthDTO extends BaseDTO {
  month: number
  obs?: string
  year: YearDTO
}