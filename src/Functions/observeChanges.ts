export function observeChanges(object: any, func: any, ...args: any[]): any {
  return new Proxy(object, {
    set: (target, key, value) => {
      func(value, ...args)

      target[key] = value

      return true
    },
  })
}
