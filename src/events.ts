// src/events.ts
import type { Cell } from './types'

export class InteractionManager {
  private index = new Map<string, Cell>()
  private handlers = new Map<string, Set<(...args: any[]) => void>>()
  private hoveredId: string | null = null

  update(cells: Cell[]): void {
    this.index.clear()
    for (const cell of cells) {
      if (cell.interactive) {
        this.index.set(`${cell.col},${cell.row}`, cell)
      }
    }
  }

  hitTest(col: number, row: number): { id: string; action: string } | null {
    const cell = this.index.get(`${col},${row}`)
    if (!cell?.interactive) return null
    return { id: cell.interactive.id, action: cell.interactive.action }
  }

  hover(col: number, row: number): void {
    const hit = this.index.get(`${col},${row}`)
    const newId = hit?.interactive?.id ?? null

    if (newId === this.hoveredId) return

    // Clear old hover
    if (this.hoveredId !== null) {
      for (const cell of this.index.values()) {
        if (cell.interactive && cell.interactive.id === this.hoveredId) {
          cell.interactive.hovered = false
        }
      }
    }

    // Set new hover
    this.hoveredId = newId
    if (newId !== null) {
      for (const cell of this.index.values()) {
        if (cell.interactive && cell.interactive.id === newId) {
          cell.interactive.hovered = true
        }
      }
    }
  }

  click(col: number, row: number): void {
    const hit = this.hitTest(col, row)
    if (!hit) return
    // Exact match
    const handlers = this.handlers.get(hit.action)
    if (handlers) {
      for (const cb of handlers) cb(hit.action)
    }
    // Prefix match for wildcard handlers (e.g., 'menu-select:*')
    for (const [pattern, cbs] of this.handlers) {
      if (pattern.endsWith(':*') && hit.action.startsWith(pattern.slice(0, -1))) {
        for (const cb of cbs) cb(hit.action)
      }
    }
  }

  fireAction(action: string): void {
    const handlers = this.handlers.get(action)
    if (handlers) {
      for (const cb of handlers) cb(action)
    }
  }

  on(action: string, cb: (...args: any[]) => void): () => void {
    if (!this.handlers.has(action)) this.handlers.set(action, new Set())
    this.handlers.get(action)!.add(cb)
    return () => { this.handlers.get(action)?.delete(cb) }
  }
}
