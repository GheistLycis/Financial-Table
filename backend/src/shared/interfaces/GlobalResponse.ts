export default interface GlobalResponse<T=unknown> { 
  data?: T
  message?: string
  status?: number
}
