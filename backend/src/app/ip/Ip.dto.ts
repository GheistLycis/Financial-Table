import BaseDTO from "src/interfaces/BaseDTO";

export default interface IpDTO extends BaseDTO {
  ip: string
  active: boolean
}