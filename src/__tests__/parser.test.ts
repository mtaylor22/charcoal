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
      expect(menu.items[0]).toMatchObject({ type: 'list-item', content: 'Home' })
      expect(menu.items[1]).toMatchObject({ type: 'list-item', content: 'About' })
      expect(menu.items[2]).toMatchObject({ type: 'list-item', content: 'Contact' })
      expect((menu as any).children).toBeUndefined()
    }
  })
})

describe('parser - inline content', () => {
  it('parses headings', () => {
    const ast = parse('# Hello World')
    const h = ast.children[0]!
    expect(h.type).toBe('heading')
    if (h.type === 'heading') {
      expect(h.level).toBe(1)
      expect(h.content).toBe('Hello World')
    }
  })

  it('parses h2 and h3', () => {
    const ast = parse('## Sub\n### Small')
    expect(ast.children[0]).toMatchObject({ type: 'heading', level: 2 })
    expect(ast.children[1]).toMatchObject({ type: 'heading', level: 3 })
  })

  it('parses horizontal rules', () => {
    const ast = parse('---')
    expect(ast.children[0]).toEqual({ type: 'rule' })
  })

  it('parses blockquotes', () => {
    const ast = parse('> hello world')
    const q = ast.children[0]!
    expect(q.type).toBe('quote')
  })

  it('parses list items', () => {
    const ast = parse('- item one\n- item two')
    const list = ast.children[0]!
    expect(list.type).toBe('list')
    if (list.type === 'list') {
      expect(list.items).toHaveLength(2)
    }
  })

  it('parses font directives', () => {
    const ast = parse('font: "Slant"')
    expect(ast.children[0]).toMatchObject({ type: 'font-directive', font: 'Slant' })
  })

  it('parses inline bold, dim, code, expressions', () => {
    const ast = parse('hello **bold** and *dim* plus `code` and {count}')
    const text = ast.children[0]!
    expect(text.type).toBe('text')
    if (text.type === 'text') {
      expect(text.segments.some(s => s.type === 'bold' && s.content === 'bold')).toBe(true)
      expect(text.segments.some(s => s.type === 'dim' && s.content === 'dim')).toBe(true)
      expect(text.segments.some(s => s.type === 'code' && s.content === 'code')).toBe(true)
      expect(text.segments.some(s => s.type === 'expression' && s.key === 'count')).toBe(true)
    }
  })

  it('parses buttons', () => {
    const ast = parse('[* continue *](-> goToZen)')
    const text = ast.children[0]!
    if (text.type === 'text') {
      expect(text.segments.some(s => s.type === 'button' && s.action === 'goToZen')).toBe(true)
    }
  })
})

describe('parser - control flow', () => {
  it('parses {#if} / {/if}', () => {
    const ast = parse('{#if scene == "title"}\n  hello\n{/if}')
    const cond = ast.children[0]!
    expect(cond.type).toBe('conditional')
    if (cond.type === 'conditional') {
      expect(cond.key).toBe('scene')
      expect(cond.operator).toBe('==')
      expect(cond.value).toBe('title')
      expect(cond.children.length).toBeGreaterThan(0)
    }
  })

  it('parses {#each} / {/each}', () => {
    const ast = parse('{#each videos as v}\n  - {v.label}\n{/each}')
    const each = ast.children[0]!
    expect(each.type).toBe('each')
    if (each.type === 'each') {
      expect(each.collection).toBe('videos')
      expect(each.itemName).toBe('v')
    }
  })
})
