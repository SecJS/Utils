/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface ExceptionJSON {
  code?: string
  name: string
  status: number
  content: string
  help?: string
  stack?: any
}
