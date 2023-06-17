import BaseDTO from "../utils/interfaces/BaseDTO";
import YearDTO from "./year";

export default interface MonthDTO extends BaseDTO {
  month: number
  obs: string
  year: YearDTO
}