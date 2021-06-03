export interface PaginationContract {
  page?: number
  limit?: number
  resourceUrl?: string
}

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

export interface ApiResponseContract {
  code: string
  path: string
  method: string
  status: number
  data: any
}

export interface PaginatedResponse<TModel> {
  data: TModel[]
  meta: PaginationMetaContract
  links: PaginationLinksContract
}

export function paginate(
  data: any[],
  total: number,
  pagination: any,
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
