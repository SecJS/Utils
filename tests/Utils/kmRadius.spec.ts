import { kmRadius } from '../../src/Utils/kmRadius'

describe('\n kmRadius Function', () => {
  it('should verify if is a valid cpf', async () => {
    expect(
      kmRadius(
        { latitude: -25503207, longitude: -545390592 },
        { latitude: -25503207, longitude: -545390592 },
      ),
    ).toBe(0)
    expect(
      kmRadius(
        { latitude: -25503207, longitude: -545390592 },
        { latitude: -254957901, longitude: -545671577 },
      ),
    ).toBe(5338.683217695541)
  })
})
