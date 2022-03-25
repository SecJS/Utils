/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '../Helpers/Exception'

export class RecursiveConfigException extends Exception {
  public constructor(fileName: string, configName: string) {
    const content = `Your config file ${fileName} is using Config.get() to an other config file that is using a Config.get('${configName}*'), creating a infinite recursive call`

    super(
      content,
      500,
      'RECURSIVE_CONFIG_ERROR',
      `Try not using the Config.get('${configName}') in the file ${fileName}`,
    )
  }
}
