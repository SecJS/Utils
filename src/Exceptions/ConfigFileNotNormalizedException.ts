/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '../Helpers/Exception'

export class ConfigFileNotNormalizedException extends Exception {
  public constructor(fileName: string) {
    const content = `Config file ${fileName} is not normalized because it is not exporting a default value`

    super(
      content,
      500,
      'CONFIG_NORMALIZED_ERROR',
      `Normalize the config file using export default {} or module.exports = {}`,
    )
  }
}
