/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface DBUrlParserContract {
  protocol: string
  user?: string
  password?: string
  host: string | string[]
  port?: number
  database: string
  options?: Record<string, string>
}
