import BaseDTO from "src/configs/BaseDTO";
import MonthDTO from "./month";

export default interface YearDTO extends BaseDTO {
  year: number
  months?: MonthDTO[]
}