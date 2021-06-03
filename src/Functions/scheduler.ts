export function scheduler(fn: any, ms: number, ...args: any[]): void {
  setInterval(fn, ms, ...args)
}
