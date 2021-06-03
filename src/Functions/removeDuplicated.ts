export function removeDuplicated(array: any[]): any[] {
  return [...new Set(array)]
}
