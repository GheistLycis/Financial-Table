import BaseDTO from "../utils/interfaces/BaseDTO";
import MonthDTO from "./month";

export default interface YearDTO extends BaseDTO {
  year: number
  months: MonthDTO[]
}