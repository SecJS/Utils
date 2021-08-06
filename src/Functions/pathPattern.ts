/**
 * Transform path or array of paths to pattern /api/v1
 *
 * @param path The path to be transformed
 * @return path string|string[] of paths transformed
 */
export function pathPattern(path: string | string[]): string | string[] {
  if (path === '/') return path

  const pattern = (path: string) => {
    const pathArray = path.split('/')

    if (pathArray[0] !== '/') pathArray.unshift('')

    return `/${pathArray.filter(p => p !== '').join('/')}`
  }

  if (typeof path !== 'string') {
    return path.map(p => pattern(p))
  }

  return pattern(path)
}
