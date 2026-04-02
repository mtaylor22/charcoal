// src/parser.ts

import type { RootNode, AstNode, TextNode } from './ast'

const BLOCK_NAMES = new Set(['box', 'row', 'col', 'scroll', 'sidebar', 'menu'])

// Matches: blockName [props] {
const BLOCK_OPEN_RE = /^(\w+)\s*(.*?)\s*\{\s*$/

// Matches a standalone closing brace
const BLOCK_CLOSE_RE = /^\}\s*$/

/**
 * Parse key=value pairs from a prop string.
 * Handles quoted values (key="some value") and numeric coercion.
 */
function parseProps(propString: string): Record<string, string | number> {
  const props: Record<string, string | number> = {}
  if (!propString.trim()) return props

  // Match key=value or key="quoted value"
  const propRe = /(\w+)=(?:"([^"]*)"|([\S]+))/g
  let match: RegExpExecArray | null
  while ((match = propRe.exec(propString)) !== null) {
    const key = match[1]!
    const value = match[2] ?? match[3]!
    // Coerce numeric values
    const num = Number(value)
    props[key] = !isNaN(num) && value !== '' ? num : value
  }
  return props
}

/**
 * Parse charcoal markup into an AST.
 */
export function parse(input: string): RootNode {
  const lines = input.split('\n')
  const root: RootNode = { type: 'root', children: [] }

  // Stack of nodes whose children we're currently populating
  const stack: { node: RootNode | (AstNode & { children: AstNode[] }) }[] = [
    { node: root },
  ]

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed === '') continue

    const current = stack[stack.length - 1]!

    // Check for block close
    if (BLOCK_CLOSE_RE.test(trimmed)) {
      if (stack.length > 1) {
        stack.pop()
      }
      continue
    }

    // Check for block open
    const blockMatch = BLOCK_OPEN_RE.exec(trimmed)
    if (blockMatch && BLOCK_NAMES.has(blockMatch[1]!)) {
      const blockType = blockMatch[1]! as string
      const props = parseProps(blockMatch[2] ?? '')

      const blockNode: AstNode & { children: AstNode[] } = {
        type: blockType,
        props,
        children: [],
      } as any

      current.node.children.push(blockNode)
      stack.push({ node: blockNode })
      continue
    }

    // Otherwise it's inline text content
    const textNode: TextNode = {
      type: 'text',
      content: trimmed,
      segments: [],
    }
    current.node.children.push(textNode)
  }

  return root
}
