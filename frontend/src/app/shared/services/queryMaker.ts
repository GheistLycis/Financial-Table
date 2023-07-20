export function queryMaker(query?: Object): string {
  if(!query) return ''
  
  return Object.entries(query)
    .filter(([ key, val ]) => {
      if(Array.isArray(val)) return val.length
      if(val == 0) return true
      else return val
    })
    .map(([ key, val ]) => key + '=' + val)
    .join('&')
}