// src/__tests__/layout.test.ts
import { describe, it, expect } from 'vitest'
import { layout } from '../layout'
import type { RootNode } from '../ast'

describe('layout - size resolution', () => {
  it('root fills entire grid', () => {
    const ast: RootNode = { type: 'root', children: [] }
    const result = layout(ast, 80, 24)
    expect(result.col).toBe(0)
    expect(result.row).toBe(0)
    expect(result.width).toBe(80)
    expect(result.height).toBe(24)
  })

  it('box with explicit width uses that width', () => {
    const ast: RootNode = {
      type: 'root',
      children: [{
        type: 'box',
        props: { width: 40 },
        children: [{ type: 'text', content: 'hello', segments: [] }],
      }],
    }
    const result = layout(ast, 80, 24)
    const box = result.children[0]!
    expect(box.width).toBe(40)
  })

  it('box with border subtracts 2 from inner width', () => {
    const ast: RootNode = {
      type: 'root',
      children: [{
        type: 'box',
        props: { border: 'single', width: 40 },
        children: [{ type: 'text', content: 'hello', segments: [] }],
      }],
    }
    const result = layout(ast, 80, 24)
    const box = result.children[0]!
    const text = box.children[0]!
    expect(text.width).toBe(38) // 40 - 2 for border
  })

  it('row divides width among children', () => {
    const ast: RootNode = {
      type: 'root',
      children: [{
        type: 'row',
        props: { gap: 2 },
        children: [
          { type: 'box', props: {}, children: [{ type: 'text', content: 'a', segments: [] }] },
          { type: 'box', props: {}, children: [{ type: 'text', content: 'b', segments: [] }] },
        ],
      }],
    }
    const result = layout(ast, 80, 24)
    const row = result.children[0]!
    // 80 total, gap=2, two children: (80 - 2) / 2 = 39 each
    expect(row.children[0]!.width).toBe(39)
    expect(row.children[1]!.width).toBe(39)
  })

  it('sidebar claims width from one side', () => {
    const ast: RootNode = {
      type: 'root',
      children: [
        { type: 'sidebar', props: { width: 15, align: 'left' }, children: [{ type: 'text', content: 'menu', segments: [] }] },
        { type: 'box', props: {}, children: [{ type: 'text', content: 'main', segments: [] }] },
      ],
    }
    const result = layout(ast, 80, 24)
    const sidebar = result.children[0]!
    const main = result.children[1]!
    expect(sidebar.width).toBe(15)
    expect(main.width).toBe(65) // 80 - 15
  })

  it('text node height is 1 row for short content', () => {
    const ast: RootNode = {
      type: 'root',
      children: [{ type: 'text', content: 'hello', segments: [] }],
    }
    const result = layout(ast, 80, 24)
    expect(result.children[0]!.height).toBe(1)
  })

  it('text node wraps and increases height', () => {
    const long = 'word '.repeat(30).trim() // ~150 chars
    const ast: RootNode = {
      type: 'root',
      children: [{ type: 'text', content: long, segments: [] }],
    }
    const result = layout(ast, 20, 24)
    expect(result.children[0]!.height).toBeGreaterThan(1)
  })
})

describe('layout - positioning', () => {
  it('stacks children vertically', () => {
    const ast: RootNode = {
      type: 'root',
      children: [
        { type: 'text', content: 'line one', segments: [] },
        { type: 'text', content: 'line two', segments: [] },
      ],
    }
    const result = layout(ast, 80, 24)
    expect(result.children[0]!.row).toBe(0)
    expect(result.children[1]!.row).toBe(1)
  })

  it('row positions children horizontally', () => {
    const ast: RootNode = {
      type: 'root',
      children: [{
        type: 'row',
        props: { gap: 2 },
        children: [
          { type: 'text', content: 'a', segments: [] },
          { type: 'text', content: 'b', segments: [] },
        ],
      }],
    }
    const result = layout(ast, 80, 24)
    const row = result.children[0]!
    expect(row.children[0]!.col).toBe(0)
    expect(row.children[1]!.col).toBe(41) // 39 + 2 gap
  })

  it('sidebar left positions content to the right', () => {
    const ast: RootNode = {
      type: 'root',
      children: [
        { type: 'sidebar', props: { width: 15, align: 'left' }, children: [{ type: 'text', content: 'menu', segments: [] }] },
        { type: 'text', content: 'main content', segments: [] },
      ],
    }
    const result = layout(ast, 80, 24)
    expect(result.children[0]!.col).toBe(0)  // sidebar at left
    expect(result.children[1]!.col).toBe(15) // content after sidebar
  })

  it('box with border offsets children by 1', () => {
    const ast: RootNode = {
      type: 'root',
      children: [{
        type: 'box',
        props: { border: 'single' },
        children: [{ type: 'text', content: 'inside', segments: [] }],
      }],
    }
    const result = layout(ast, 80, 24)
    const box = result.children[0]!
    const text = box.children[0]!
    expect(text.col).toBe(1) // offset by border
    expect(text.row).toBe(1) // offset by border
  })

  it('centered box is offset horizontally', () => {
    const ast: RootNode = {
      type: 'root',
      children: [{
        type: 'box',
        props: { align: 'center', width: 40 },
        children: [{ type: 'text', content: 'hello', segments: [] }],
      }],
    }
    const result = layout(ast, 80, 24)
    const box = result.children[0]!
    expect(box.col).toBe(20) // (80 - 40) / 2
  })
})
