export function scheduler(fn: any, ms: number, ...args: any[]): NodeJS.Timeout {
  return setInterval(fn, ms, ...args)
}
