import { floatFormet } from '@/util'

describe('util test', () => {
  it('floatFormet()', () => {
    const float = floatFormet(12.3456789, 3)
    expect(float).toBe(12.345)
  })
})
