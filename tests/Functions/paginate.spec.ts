import { paginate } from '../../src/Functions/paginate'

describe('\n paginate Function', () => {
  it('should be able to paginate a collection of data', async () => {
    let i = 0
    const collection = []

    while (i < 10) {
      collection.push({
        joao: 'lenon',
        hello: 'world',
      })

      i++
    }

    const paginatedData = paginate(collection, collection.length + 1, {
      page: 0,
      limit: 10,
      resourceUrl: 'https://secjs.dev/joaos',
    })

    expect(paginatedData.data).toStrictEqual(collection)
    expect(paginatedData.meta).toStrictEqual({
      itemCount: 10,
      totalItems: 11,
      totalPages: 2,
      currentPage: 0,
      itemsPerPage: 10,
    })
    expect(paginatedData.links).toStrictEqual({
      first: 'https://secjs.dev/joaos?limit=10',
      previous: 'https://secjs.dev/joaos?page=0&limit=10',
      next: 'https://secjs.dev/joaos?page=1&limit=10',
      last: 'https://secjs.dev/joaos?page=2&limit=10',
    })
  })
})
