import { pathPattern } from '../../src/Functions/pathPattern'

describe('\n pathPattern Function', () => {
  it('should transform any path to the pattern /api/v1', async () => {
    const path1 = '/users/:id/'
    const path2 = 'clients/'
    const path3 = '/api/v2'
    const path4 = '/api/v3/'

    const paths = ['/api/v1/', 'api/v2', 'api/v3/', '/api/v4']

    expect(pathPattern(path1)).toStrictEqual('/users/:id')
    expect(pathPattern(path2)).toStrictEqual('/clients')
    expect(pathPattern(path3)).toStrictEqual('/api/v2')
    expect(pathPattern(path4)).toStrictEqual('/api/v3')
    expect(pathPattern(paths)).toStrictEqual([
      '/api/v1',
      '/api/v2',
      '/api/v3',
      '/api/v4',
    ])
  })
})
