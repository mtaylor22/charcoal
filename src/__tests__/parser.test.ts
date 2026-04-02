// src/__tests__/parser.test.ts
import { describe, it, expect } from 'vitest'
import { parse } from '../parser'

describe('parser - blocks', () => {
  it('parses empty input as root with no children', () => {
    const ast = parse('')
    expect(ast).toEqual({ type: 'root', children: [] })
  })

  it('parses a simple box block', () => {
    const ast = parse('box border=single {\n  hello\n}')
    expect(ast.children).toHaveLength(1)
    const box = ast.children[0]!
    expect(box.type).toBe('box')
    if (box.type === 'box') {
      expect(box.props.border).toBe('single')
    }
  })

  it('parses nested blocks', () => {
    const ast = parse(`
row gap=2 {
  box width=30 {
    hello
  }
  box {
    world
  }
}`)
    expect(ast.children).toHaveLength(1)
    const row = ast.children[0]!
    if (row.type === 'row') {
      expect(row.props.gap).toBe(2)
      expect(row.children).toHaveLength(2)
    }
  })

  it('parses sidebar with align', () => {
    const ast = parse('sidebar width=15 align=left {\n  content\n}')
    const sidebar = ast.children[0]!
    if (sidebar.type === 'sidebar') {
      expect(sidebar.props.width).toBe(15)
      expect(sidebar.props.align).toBe('left')
    }
  })

  it('parses scroll with height', () => {
    const ast = parse('scroll height=20 {\n  content\n}')
    const scroll = ast.children[0]!
    if (scroll.type === 'scroll') {
      expect(scroll.props.height).toBe(20)
    }
  })

  it('parses quoted prop values', () => {
    const ast = parse('box font="ANSI Shadow" {\n  hello\n}')
    const box = ast.children[0]!
    if (box.type === 'box') {
      expect(box.props.font).toBe('ANSI Shadow')
    }
  })

  it('parses menu block with items instead of children', () => {
    const ast = parse('menu bind=nav {\n  - Home\n  - About\n  - Contact\n}')
    expect(ast.children).toHaveLength(1)
    const menu = ast.children[0]!
    expect(menu.type).toBe('menu')
    if (menu.type === 'menu') {
      expect(menu.props.bind).toBe('nav')
      expect(menu.items).toHaveLength(3)
      expect(menu.items[0]).toEqual({ type: 'list-item', content: 'Home', segments: [] })
      expect(menu.items[1]).toEqual({ type: 'list-item', content: 'About', segments: [] })
      expect(menu.items[2]).toEqual({ type: 'list-item', content: 'Contact', segments: [] })
      expect((menu as any).children).toBeUndefined()
    }
  })
})
