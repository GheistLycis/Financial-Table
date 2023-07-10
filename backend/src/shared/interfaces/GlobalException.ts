export default interface GlobalException { 
  status: number 
  message: string
}

export function isInstanceOfGlobalException(err: any): err is GlobalException {
  return (
    ('status' in err) && 
    ('message' in err)
  )
}