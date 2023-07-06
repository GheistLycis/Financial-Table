export function queryMaker(query: Object): string {
  return Object.entries(query)
    .filter(([ key, val ]) => Boolean(val))
    .map(([ key, val ]) => key + '=' + val)
    .join('&')
}