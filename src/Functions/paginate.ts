import { PaginatedResponse, PaginationContract } from '@secjs/contracts'

export function paginate(
  data: any[],
  total: number,
  pagination: PaginationContract,
): PaginatedResponse<any> {
  const totalPages = Math.ceil(total / pagination.limit)

  const meta = {
    itemCount: data.length,
    totalItems: total,
    totalPages: totalPages,
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

  return { data, meta, links }
}
