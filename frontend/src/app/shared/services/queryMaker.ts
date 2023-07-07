export function queryMaker(query: Object): string {
  return Object.entries(query)
    .filter(([ key, val ]) => {
      if(Array.isArray(val)) return val.length
      else return val
    })
    .map(([ key, val ]) => key + '=' + val)
    .join('&')
}