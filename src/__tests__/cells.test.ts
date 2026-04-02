// src/__tests__/cells.test.ts
import { describe, it, expect } from 'vitest'
import { emitCells } from '../cells'
import { layout } from '../layout'
import type { RootNode } from '../ast'

describe('cell emitter', () => {
  it('emits cells for plain text', () => {
    const ast: RootNode = {
      type: 'root',
      children: [{ type: 'text', content: 'hi', segments: [{ type: 'plain', content: 'hi' }] }],
    }
    const tree = layout(ast, 80, 24)
    const cells = emitCells(tree)
    expect(cells.length).toBe(2)
    expect(cells[0]).toMatchObject({ col: 0, row: 0, char: 'h' })
    expect(cells[1]).toMatchObject({ col: 1, row: 0, char: 'i' })
  })

  it('emits border cells for box with border=single', () => {
    const ast: RootNode = {
      type: 'root',
      children: [{
        type: 'box',
        props: { border: 'single', width: 10, height: 3 },
        children: [],
      }],
    }
    const tree = layout(ast, 80, 24)
    const cells = emitCells(tree)
    const corners = cells.filter(c => c.char === '+')
    expect(corners.length).toBe(4)
    const dashes = cells.filter(c => c.char === '-')
    expect(dashes.length).toBe(16) // 8 top + 8 bottom (width 10 - 2 corners = 8 each)
    const pipes = cells.filter(c => c.char === '|')
    expect(pipes.length).toBe(2) // 1 row of content height, 2 sides (height=3 means 1 inner row)
  })

  it('marks button cells as interactive', () => {
    const ast: RootNode = {
      type: 'root',
      children: [{
        type: 'text',
        content: '',
        segments: [{ type: 'button', label: 'go', action: 'doIt' }],
      }],
    }
    const tree = layout(ast, 80, 24)
    const cells = emitCells(tree)
    const interactive = cells.filter(c => c.interactive)
    expect(interactive.length).toBeGreaterThan(0)
    expect(interactive[0]!.interactive!.action).toBe('doIt')
  })

  it('emits rule as dash characters across full width', () => {
    const ast: RootNode = {
      type: 'root',
      children: [{ type: 'rule' }],
    }
    const tree = layout(ast, 20, 24)
    const cells = emitCells(tree)
    expect(cells.every(c => c.char === '─')).toBe(true)
    expect(cells.length).toBe(20)
  })

  it('emits heading with heading font', () => {
    const ast: RootNode = {
      type: 'root',
      children: [{ type: 'heading', level: 1, content: 'Hi' }],
    }
    const tree = layout(ast, 80, 24)
    const cells = emitCells(tree)
    expect(cells.length).toBe(2)
    expect(cells[0]).toMatchObject({ char: 'H', font: '800 heading' })
  })

  it('emits list items with bullet prefix', () => {
    const ast: RootNode = {
      type: 'root',
      children: [{
        type: 'list',
        items: [
          { type: 'list-item', content: 'one', segments: [{ type: 'plain', content: 'one' }] },
          { type: 'list-item', content: 'two', segments: [{ type: 'plain', content: 'two' }] },
        ],
      }],
    }
    const tree = layout(ast, 80, 24)
    const cells = emitCells(tree)
    const bullets = cells.filter(c => c.char === '•')
    expect(bullets.length).toBe(2)
  })

  it('emits menu items as interactive', () => {
    const ast: RootNode = {
      type: 'root',
      children: [{
        type: 'menu',
        props: { bind: 'selected' },
        items: [
          { type: 'list-item', content: 'fire', segments: [{ type: 'plain', content: 'fire' }] },
          { type: 'list-item', content: 'ice', segments: [{ type: 'plain', content: 'ice' }] },
        ],
      }],
    }
    const tree = layout(ast, 80, 24)
    const cells = emitCells(tree)
    const interactive = cells.filter(c => c.interactive)
    expect(interactive.length).toBeGreaterThan(0)
  })
})
