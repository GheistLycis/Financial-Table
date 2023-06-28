export default class DecimalTransformer {
  to(data: number): number {
    return data
  }
  
  from(data: string): number {
    return parseFloat(data)
  }
}