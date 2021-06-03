import { Clean } from '../../src/Classes/Clean'

describe('\n Clean Class', () => {
  let clean: Clean

  beforeAll(() => {
    clean = new Clean()
  })

  it('should clean all falsy values from array and empty when needed', () => {
    const array = [
      1,
      null,
      2,
      undefined,
      3,
      { joao: 'joao', lenon: null },
      '',
      {},
    ]

    clean.cleanArray(array)
    expect(array).toStrictEqual([1, 2, 3, { joao: 'joao', lenon: null }, {}])

    clean.cleanArray(array, true, true)
    expect(array).toStrictEqual([1, 2, 3, { joao: 'joao' }])
  })

  it('should clean all falsy values from object and empty when needed', () => {
    const object = {
      a: 'a',
      b: 'b',
      c: 'c',
      d: {},
      e: [],
      f: { joao: 'joao' },
      g: null,
      h: undefined,
      i: [null, 1, { joao: 'joao', lenon: null }, {}],
    }

    clean.cleanObject(object)

    expect(object).toStrictEqual({
      a: 'a',
      b: 'b',
      c: 'c',
      d: {},
      e: [],
      f: { joao: 'joao' },
      i: [null, 1, { joao: 'joao', lenon: null }, {}],
    })

    clean.cleanObject(object, true, true)

    expect(object).toStrictEqual({
      a: 'a',
      b: 'b',
      c: 'c',
      f: { joao: 'joao' },
      i: [1, { joao: 'joao' }],
    })
  })
})
