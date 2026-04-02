import { describe, it, expect } from 'vitest'
import { gradient } from '../backgrounds/gradient'

describe('gradient background', () => {
  it('rainbow cycles hue across columns', () => {
    const bg = gradient('rainbow')
    bg.setup(80, 24)
    const left = bg.sample(0, 12, 0)
    const mid = bg.sample(40, 12, 0)
    const right = bg.sample(79, 12, 0)
    expect(left).not.toEqual(mid)
    expect(mid).not.toEqual(right)
  })

  it('linear gradient interpolates between two colors', () => {
    const bg = gradient('linear', { from: '#ff0000', to: '#0000ff', angle: 0 })
    bg.setup(80, 24)
    const left = bg.sample(0, 12, 0)
    const right = bg.sample(79, 12, 0)
    expect(left[0]).toBeGreaterThan(left[2]) // more red on left
    expect(right[2]).toBeGreaterThan(right[0]) // more blue on right
  })

  it('rainbow returns valid RGB values', () => {
    const bg = gradient('rainbow')
    bg.setup(100, 50)
    for (let col = 0; col < 100; col += 10) {
      const [r, g, b] = bg.sample(col, 25, 0)
      expect(r).toBeGreaterThanOrEqual(0)
      expect(r).toBeLessThanOrEqual(255)
      expect(g).toBeGreaterThanOrEqual(0)
      expect(g).toBeLessThanOrEqual(255)
      expect(b).toBeGreaterThanOrEqual(0)
      expect(b).toBeLessThanOrEqual(255)
    }
  })
})
