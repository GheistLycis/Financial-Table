import BaseDTO from "src/database/BaseDTO";
import MonthDTO from "./month";

export default interface YearDTO extends BaseDTO {
  year: string
  months?: MonthDTO[]
}