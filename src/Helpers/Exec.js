/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { promisify } from 'node:util'
import { Transform } from 'node:stream'
import { request as requestHttp } from 'node:http'
import { request as requestHttps } from 'node:https'
import { exec as childProcessExec } from 'node:child_process'

import { File } from '#src/Helpers/File'
import { Options } from '#src/Helpers/Options'
import { NodeCommandException } from '#src/Exceptions/NodeCommandException'

const exec = promisify(childProcessExec)

export class Exec {
  /**
   * Sleep the code in the line that this function
   * is being called.
   *
   * @param {number} ms
   * @return {Promise<void>}
   */
  static async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Execute a command of child process exec as promise.
   *
   * @param {string} command
   * @param {{
   *   ignoreErrors?: boolean
   * }} [options]
   * @throws {NodeCommandException}
   * @return {Promise<{ stdout: string, stderr: string }>}
   */
  static async command(command, options) {
    options = Options.create(options, {
      withContent: true,
      mockedValues: false,
    })

    try {
      // Needs to await explicit because of try catch
      return await exec(command)
    } catch (error) {
      if (options.ignoreErrors) {
        return { stdout: error.stdout, stderr: error.stderr }
      }

      throw new NodeCommandException(command, error.stdout, error.stderr)
    }
  }

  /**
   * Download an archive to determined path.
   *
   * @param {string} name
   * @param {string} path
   * @param {string} url
   * @return {Promise<File>}
   */
  static async download(name, path, url) {
    return new Promise((resolve, reject) => {
      const callback = response => {
        const data = new Transform()

        response.on('data', chunk => data.push(chunk))

        response.on('end', function () {
          resolve(new File(`${path}/${name}`, data.read()).loadSync())
        })

        response.on('error', error => reject(error))
      }

      if (url.includes('https')) {
        requestHttps(url, callback).end()

        return
      }

      requestHttp(url, callback).end()
    })
  }

  /**
   * Paginate a collection of data.
   *
   * @param {any[]} data
   * @param {number} total
   * @param {{
   *   page?: number,
   *   limit?: number,
   *   resourceUrl?: string
   * }} pagination
   * @return {{
   *   data: any[],
   *   meta: {
   *     totalItems: number,
   *     itemsPerPage: number,
   *     totalPages: number,
   *     currentPage: number,
   *     itemCount: number
   *  },
   *  links: {
   *    next: string,
   *    previous: string,
   *    last: string,
   *    first: string
   *  }
   * }}
   */
  static pagination(data, total, pagination) {
    const totalPages = Math.ceil(total / pagination.limit)

    const meta = {
      itemCount: data.length,
      totalItems: total,
      totalPages,
      currentPage: pagination.page,
      itemsPerPage: pagination.limit,
    }

    let nextPage = 1
    let previousPage = 0

    if (meta.currentPage && meta.currentPage < meta.totalPages) {
      nextPage = meta.currentPage + 1
      previousPage = meta.currentPage - 1
    }

    const links = {
      first: `${pagination.resourceUrl}?limit=${meta.itemsPerPage}`,
      previous: `${pagination.resourceUrl}?page=${previousPage}&limit=${meta.itemsPerPage}`,
      next: `${pagination.resourceUrl}?page=${nextPage}&limit=${meta.itemsPerPage}`,
      last: `${pagination.resourceUrl}?page=${totalPages}&limit=${meta.itemsPerPage}`,
    }

    return { meta, links, data }
  }
}
