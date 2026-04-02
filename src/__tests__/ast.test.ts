// src/__tests__/ast.test.ts
import { describe, it, expect } from 'vitest'
import type {
  AstNode, RootNode, BoxNode, RowNode, ColNode,
  ScrollNode, SidebarNode, MenuNode, TextNode,
  HeadingNode, RuleNode, ButtonNode, QuoteNode,
  ListNode, ListItemNode, CodeNode, BoldNode,
  DimNode, ExpressionNode, ConditionalNode, EachNode,
  FontDirectiveNode,
} from '../ast'

describe('AST types', () => {
  it('can construct a root node with children', () => {
    const root: RootNode = {
      type: 'root',
      children: [
        {
          type: 'box',
          props: { border: 'single', align: 'center' },
          children: [
            { type: 'text', content: 'hello', segments: [] },
          ],
        },
      ],
    }
    expect(root.type).toBe('root')
    expect(root.children).toHaveLength(1)
  })

  it('can construct inline nodes', () => {
    const bold: BoldNode = { type: 'bold', content: 'strong' }
    const dim: DimNode = { type: 'dim', content: 'faded' }
    const code: CodeNode = { type: 'code', content: 'x = 1' }
    const expr: ExpressionNode = { type: 'expression', key: 'count' }
    expect(bold.type).toBe('bold')
    expect(dim.type).toBe('dim')
    expect(code.type).toBe('code')
    expect(expr.key).toBe('count')
  })

  it('can construct control flow nodes', () => {
    const cond: ConditionalNode = {
      type: 'conditional',
      key: 'scene',
      operator: '==',
      value: 'title',
      children: [{ type: 'text', content: 'hi', segments: [] }],
    }
    const each: EachNode = {
      type: 'each',
      collection: 'videos',
      itemName: 'v',
      children: [{ type: 'text', content: '{v.label}', segments: [] }],
    }
    expect(cond.operator).toBe('==')
    expect(each.itemName).toBe('v')
  })
})
