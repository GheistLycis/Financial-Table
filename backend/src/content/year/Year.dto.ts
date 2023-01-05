import BaseDTO from "src/common/BaseDTO";
import MonthDTO from "../month/Month.dto";

export default interface YearDTO extends BaseDTO {
  year: number
  months?: MonthDTO[]
}