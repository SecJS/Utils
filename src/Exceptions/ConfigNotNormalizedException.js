/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '#src/Helpers/Exception'

export class ConfigNotNormalizedException extends Exception {
  /**
   * Creates a new instance of ConfigNotNormalizedException.
   *
   * @param {string} filePath
   * @return {ConfigNotNormalizedException}
   */
  constructor(filePath) {
    const content = `The configuration file ${filePath} is not normalized because it is not exporting a default value.`

    super(
      content,
      500,
      'E_CONFIG_NORMALIZED',
      'Normalize the config file using export default {} or module.exports = {}.',
    )
  }
}
