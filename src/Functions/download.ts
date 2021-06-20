import { Transform } from 'stream'
import { writeFile } from 'fs/promises'
import { request as requestHttp } from 'http'
import { request as requestHttps } from 'https'

/**
 * Download an archive/image to determined path
 *
 * @param url The url to fetch the download
 * @param name The name that the file is going to have
 * @param path The path where the file is going to be saved
 */
export async function download(
  url: string,
  name: string,
  path: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const callback = response => {
      const data = new Transform()

      response.on('data', chunk => {
        data.push(chunk)
      })

      response.on('end', function () {
        resolve(writeFile(`${path}/${name}`, data.read()))
      })

      response.on('error', () => {
        reject(new Error('Something is wrong in url'))
      })
    }

    if (url.includes('https')) {
      requestHttps(url, callback).end()

      return
    }

    requestHttp(url, callback).end()
  })
}
