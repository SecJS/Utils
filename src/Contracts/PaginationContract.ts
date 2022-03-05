/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface PaginationMetaContract {
  itemCount: number
  totalItems: number
  totalPages: number
  currentPage: number
  itemsPerPage: number
}

export interface PaginationLinksContract {
  first: string
  previous: string
  next: string
  last: string
}

export interface PaginatedResponse<T = any[]> {
  meta: PaginationMetaContract
  links: PaginationLinksContract
  data: T
}

export interface PaginationContract {
  page?: number
  limit?: number
  resourceUrl?: string
}
