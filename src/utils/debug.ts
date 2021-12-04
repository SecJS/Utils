import debug from 'debug'

import Chalk from 'chalk'

function format(message: any) {
  const pid = Chalk.hex('#7059C1')(`[SecJS Debugger] - PID: ${process.pid}`)
  const timestamp = getTimestamp()
  const messageCtx = Chalk.hex('#ffe600')(`[Environment] `)

  return `${pid} - ${timestamp} ${messageCtx}${Chalk.hex('#7059C1')(message)}`
}

function getTimestamp(): string {
  const localeStringOptions = {
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    day: '2-digit',
    month: '2-digit',
  }

  return new Date(Date.now()).toLocaleString(
    undefined,
    localeStringOptions as Intl.DateTimeFormatOptions,
  )
}

export function debugFn(message: string) {
  debug('api:utils')(format(message))
}
