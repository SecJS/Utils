import { promises } from 'fs'
import { Blacklist } from '../../src/Helpers/Blacklist'

describe('\n Blacklist Class', () => {
  let blacklist: Blacklist

  const value = 'zap'
  const filePath = 'blacklist.txt'

  beforeAll(async () => {
    blacklist = new Blacklist()
  })

  afterAll(async () => {
    await promises.unlink(filePath)
  })

  it('should be able to add values to a blacklist', async () => {
    await blacklist.add('test', filePath)
    await blacklist.add('hello', filePath)

    const file = await promises.readFile(filePath)

    expect(file.includes('test')).toBe(true)
  })

  it('should be able to find values inside of a blacklist', async () => {
    await blacklist.add(value, filePath)

    const valueFound = await blacklist.find(value, filePath)

    expect(valueFound).toBe(value)
  })

  it('should be able to remove values inside of a blacklist', async () => {
    await blacklist.add(value, filePath)
    await blacklist.remove(value, filePath)

    const file = await promises.readFile(filePath)

    expect(file.includes(value)).toBe(false)
  })
})
