import { unset as unsetFn } from '../Functions/unset'
import { Path as PathInstance } from '../Classes/Path'

export {}

declare global {
  class Path {
    static nodeCwdPath(): string
    static forceBuild(): typeof Path
    static pwd(subPath?: string): string
    static app(subPath?: string): string
    static switchEnvVerify(): typeof Path
    static logs(subPath?: string): string
    static start(subPath?: string): string
    static views(subPath?: string): string
    static tests(subPath?: string): string
    static config(subPath?: string): string
    static public(subPath?: string): string
    static assets(subPath?: string): string
    static storage(subPath?: string): string
    static locales(subPath?: string): string
    static database(subPath?: string): string
    static resources(subPath?: string): string
    static providers(subPath?: string): string
    static forBuild(name: string): typeof Path
    static changeBuild(name: string): typeof Path
  }
  function unset(object: any): void
}

const _global = global as any

// Classes
_global.Path = PathInstance

// Functions
_global.unset = unsetFn
