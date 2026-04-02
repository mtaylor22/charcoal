// src/__tests__/palette.test.ts
import { describe, it, expect } from 'vitest'
import { rgbToHsl, hslToCss } from '../palette'

describe('palette', () => {
  it('rgbToHsl converts white', () => {
    const [h, s, l] = rgbToHsl(255, 255, 255)
    expect(l).toBeCloseTo(1, 1)
    expect(s).toBeCloseTo(0, 1)
  })

  it('rgbToHsl converts pure red', () => {
    const [h, s, l] = rgbToHsl(255, 0, 0)
    expect(h).toBeCloseTo(0, 1)
    expect(s).toBeCloseTo(1, 1)
  })

  it('rgbToHsl converts pure green', () => {
    const [h, s, l] = rgbToHsl(0, 255, 0)
    expect(h).toBeCloseTo(0.333, 1)
  })

  it('rgbToHsl converts black', () => {
    const [h, s, l] = rgbToHsl(0, 0, 0)
    expect(l).toBe(0)
  })

  it('rgbToHsl converts blue', () => {
    const [h, s, l] = rgbToHsl(0, 0, 255)
    expect(h).toBeCloseTo(0.667, 1)
  })

  it('hslToCss formats correctly', () => {
    const css = hslToCss(0.5, 0.8, 0.6)
    expect(css).toBe('hsl(180, 80%, 60%)')
  })
})
