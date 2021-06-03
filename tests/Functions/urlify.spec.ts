import { urlify } from '../../src/Functions/urlify'

describe('\n urlify Function', () => {
  it('should be able to urlify urls with <a></a> from html inside strings', async () => {
    const string =
      'this is a string with one link - https://joao.com and other link https://joaolenon.com and https://lenon.com'

    expect(urlify(string)).toBeTruthy()
  })
})
