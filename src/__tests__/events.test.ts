import { describe, it, expect, vi } from 'vitest'
import { InteractionManager } from '../events'
import type { Cell } from '../types'

describe('InteractionManager', () => {
  it('resolves cell hit from coordinates', () => {
    const cells: Cell[] = [
      { col: 5, row: 3, char: 'g', font: '', interactive: { id: 'btn1', action: 'go', hovered: false } },
      { col: 6, row: 3, char: 'o', font: '', interactive: { id: 'btn1', action: 'go', hovered: false } },
    ]
    const mgr = new InteractionManager()
    mgr.update(cells)
    const hit = mgr.hitTest(5, 3)
    expect(hit).toBeTruthy()
    expect(hit!.action).toBe('go')
  })

  it('returns null for miss', () => {
    const mgr = new InteractionManager()
    mgr.update([])
    expect(mgr.hitTest(0, 0)).toBeNull()
  })

  it('fires action callbacks on click', () => {
    const cells: Cell[] = [
      { col: 0, row: 0, char: 'x', font: '', interactive: { id: 'btn1', action: 'doIt', hovered: false } },
    ]
    const mgr = new InteractionManager()
    mgr.update(cells)
    const cb = vi.fn()
    mgr.on('doIt', cb)
    mgr.click(0, 0)
    expect(cb).toHaveBeenCalled()
  })

  it('hover sets and clears hovered state', () => {
    const cells: Cell[] = [
      { col: 0, row: 0, char: 'x', font: '', interactive: { id: 'btn1', action: 'go', hovered: false } },
      { col: 1, row: 0, char: 'y', font: '', interactive: { id: 'btn1', action: 'go', hovered: false } },
    ]
    const mgr = new InteractionManager()
    mgr.update(cells)
    mgr.hover(0, 0)
    expect(cells[0]!.interactive!.hovered).toBe(true)
    expect(cells[1]!.interactive!.hovered).toBe(true) // same id, both hovered
    mgr.hover(5, 5) // move away
    expect(cells[0]!.interactive!.hovered).toBe(false)
    expect(cells[1]!.interactive!.hovered).toBe(false)
  })

  it('unsubscribe removes handler', () => {
    const mgr = new InteractionManager()
    const cells: Cell[] = [
      { col: 0, row: 0, char: 'x', font: '', interactive: { id: 'btn1', action: 'doIt', hovered: false } },
    ]
    mgr.update(cells)
    const cb = vi.fn()
    const unsub = mgr.on('doIt', cb)
    unsub()
    mgr.click(0, 0)
    expect(cb).not.toHaveBeenCalled()
  })

  it('does not fire for non-interactive cells', () => {
    const cells: Cell[] = [
      { col: 0, row: 0, char: 'x', font: '' },
    ]
    const mgr = new InteractionManager()
    mgr.update(cells)
    const cb = vi.fn()
    mgr.on('anything', cb)
    mgr.click(0, 0)
    expect(cb).not.toHaveBeenCalled()
  })
})
