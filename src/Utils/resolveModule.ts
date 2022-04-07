import { Is } from '../Helpers/Is'

export function resolveModule(module: any) {
  if (Is.Class(module)) {
    return module
  }

  if (Is.Object(module) && !module.default) {
    const firstProviderKey = Object.keys(module)[0]

    return module[firstProviderKey]
  }

  return module.default()
}
