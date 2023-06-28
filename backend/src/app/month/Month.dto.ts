import BaseDTO from "src/shared/interfaces/BaseDTO";
import YearDTO from "../year/Year.dto";

export default interface MonthDTO extends BaseDTO {
  month: number
  available: number
  obs?: string
  year: YearDTO
}