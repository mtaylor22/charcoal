import { describe, it, expect, vi } from 'vitest'
import { StateStore } from '../state'

describe('StateStore', () => {
  it('get and set values', () => {
    const store = new StateStore()
    store.set('x', 42)
    expect(store.get('x')).toBe(42)
  })

  it('returns undefined for unset keys', () => {
    const store = new StateStore()
    expect(store.get('missing')).toBeUndefined()
  })

  it('fires watchers on change', () => {
    const store = new StateStore()
    const cb = vi.fn()
    store.watch('x', cb)
    store.set('x', 1)
    expect(cb).toHaveBeenCalledWith(1)
  })

  it('does not fire watcher when value unchanged', () => {
    const store = new StateStore()
    store.set('x', 1)
    const cb = vi.fn()
    store.watch('x', cb)
    store.set('x', 1)
    expect(cb).not.toHaveBeenCalled()
  })

  it('unwatch removes listener', () => {
    const store = new StateStore()
    const cb = vi.fn()
    const unsub = store.watch('x', cb)
    unsub()
    store.set('x', 99)
    expect(cb).not.toHaveBeenCalled()
  })

  it('fires global onChange for any mutation', () => {
    const store = new StateStore()
    const cb = vi.fn()
    store.onChange(cb)
    store.set('a', 1)
    store.set('b', 2)
    expect(cb).toHaveBeenCalledTimes(2)
  })
})
