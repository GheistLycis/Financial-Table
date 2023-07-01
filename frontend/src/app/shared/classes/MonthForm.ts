import YearDTO from "../DTOs/year"

export default class MonthForm {
  month: number
  available: number
  obs: string
  year: YearDTO['id']
}