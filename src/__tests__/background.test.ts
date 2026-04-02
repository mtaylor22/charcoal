import { describe, it, expect } from 'vitest'
import { solid, fn, type Background } from '../background'

describe('background', () => {
  it('solid returns constant color', () => {
    const bg = solid('#ff0000')
    const sample = bg.sample(5, 5, 0)
    expect(sample).toEqual([255, 0, 0])
  })

  it('solid parses shorthand hex', () => {
    const bg = solid('#f00')
    expect(bg.sample(0, 0, 0)).toEqual([255, 0, 0])
  })

  it('solid parses green', () => {
    const bg = solid('#00ff00')
    expect(bg.sample(0, 0, 0)).toEqual([0, 255, 0])
  })

  it('fn background calls custom function', () => {
    const bg = fn((col, row, _t) => [col * 10, row * 10, 0])
    expect(bg.sample(5, 3, 0)).toEqual([50, 30, 0])
  })

  it('background has setup and teardown lifecycle', () => {
    const bg = solid('#000')
    expect(typeof bg.setup).toBe('function')
    expect(typeof bg.teardown).toBe('function')
  })

  it('fn background passes time parameter', () => {
    const bg = fn((_c, _r, t) => [t, t, t])
    expect(bg.sample(0, 0, 128)).toEqual([128, 128, 128])
  })
})
