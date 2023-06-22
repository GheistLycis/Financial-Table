import BaseDTO from "src/shared/interfaces/BaseDTO";

export default interface IpDTO extends BaseDTO {
  ip: string
  active: boolean
}