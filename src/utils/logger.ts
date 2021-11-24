import {
  DebugFormatter,
  DebugTransporter,
  Logger,
  LogMapper,
} from '@secjs/logger'

export default new Logger(
  'Debug',
  new LogMapper([new DebugFormatter()], [new DebugTransporter('api:utils')]),
)
