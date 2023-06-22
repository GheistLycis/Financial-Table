export default interface GlobalException { 
  code: number 
  message: string
}

export function isInstanceOfGlobalException(err: any): err is GlobalException {
  return (
    ('code' in err) && 
    ('message' in err)
  )
}