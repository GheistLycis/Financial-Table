import BaseDTO from "./baseDTO";
import MonthDTO from "./month";

export default interface YearDTO extends BaseDTO {
  year: string
  months?: MonthDTO[]
}