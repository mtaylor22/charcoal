// src/parser.ts

import type {
  RootNode,
  AstNode,
  TextNode,
  TextSegment,
  MenuNode,
  ListItemNode,
  ListNode,
  HeadingNode,
  RuleNode,
  QuoteNode,
  FontDirectiveNode,
  ConditionalNode,
  EachNode,
} from './ast'

const BLOCK_NAMES = new Set(['box', 'row', 'col', 'scroll', 'sidebar', 'menu'])

// Matches: blockName [props] {
const BLOCK_OPEN_RE = /^(\w+)\s*(.*?)\s*\{\s*$/

// Matches a standalone closing brace
const BLOCK_CLOSE_RE = /^\}\s*$/

// Control flow patterns
const IF_OPEN_RE = /^\{#if\s+(\w+)\s*(==|!=)\s*"([^"]*)"\}$/
const IF_CLOSE_RE = /^\{\/if\}$/
const EACH_OPEN_RE = /^\{#each\s+(\w+)\s+as\s+(\w+)\}$/
const EACH_CLOSE_RE = /^\{\/each\}$/

// Inline content patterns
const HEADING_RE = /^(#{1,3})\s+(.+)$/
const RULE_RE = /^---+$/
const QUOTE_RE = /^>\s+(.+)$/
const LIST_ITEM_RE = /^-\s+(.+)$/
const FONT_DIRECTIVE_RE = /^font:\s*"([^"]+)"$/

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
 * Parse inline segments from a text string.
 * Recognizes **bold**, *dim*, `code`, {expression}, and [label](-> action).
 */
export function parseInlineSegments(text: string): TextSegment[] {
  const segments: TextSegment[] = []
  // Pattern order matters: ** before *, and {#...}/{/...} are excluded from expression
  const inlineRe = /\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\{([^}#/][^}]*)\}|\[([^\]]+)\]\(->\s*([^)]+)\)/g
  let lastIndex = 0
  let m: RegExpExecArray | null

  while ((m = inlineRe.exec(text)) !== null) {
    // Add plain text before this match
    if (m.index > lastIndex) {
      segments.push({ type: 'plain', content: text.slice(lastIndex, m.index) })
    }

    if (m[1] !== undefined) {
      segments.push({ type: 'bold', content: m[1] })
    } else if (m[2] !== undefined) {
      segments.push({ type: 'dim', content: m[2] })
    } else if (m[3] !== undefined) {
      segments.push({ type: 'code', content: m[3] })
    } else if (m[4] !== undefined) {
      segments.push({ type: 'expression', key: m[4] })
    } else if (m[5] !== undefined && m[6] !== undefined) {
      segments.push({ type: 'button', label: m[5], action: m[6].trim() })
    }

    lastIndex = m.index + m[0].length
  }

  // Trailing plain text
  if (lastIndex < text.length) {
    segments.push({ type: 'plain', content: text.slice(lastIndex) })
  }

  return segments
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

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i]!.trim()
    if (trimmed === '') continue

    const current = stack[stack.length - 1]!

    // Check for block close
    if (BLOCK_CLOSE_RE.test(trimmed)) {
      if (stack.length > 1) {
        stack.pop()
      }
      continue
    }

    // Check for control flow closing tags
    if (IF_CLOSE_RE.test(trimmed)) {
      if (stack.length > 1) {
        stack.pop()
      }
      continue
    }

    if (EACH_CLOSE_RE.test(trimmed)) {
      if (stack.length > 1) {
        stack.pop()
      }
      continue
    }

    // Check for {#if ...}
    const ifMatch = IF_OPEN_RE.exec(trimmed)
    if (ifMatch) {
      const condNode: ConditionalNode = {
        type: 'conditional',
        key: ifMatch[1]!,
        operator: ifMatch[2]! as '==' | '!=',
        value: ifMatch[3]!,
        children: [],
      }
      current.node.children.push(condNode)
      stack.push({ node: condNode as any })
      continue
    }

    // Check for {#each ...}
    const eachMatch = EACH_OPEN_RE.exec(trimmed)
    if (eachMatch) {
      const eachNode: EachNode = {
        type: 'each',
        collection: eachMatch[1]!,
        itemName: eachMatch[2]!,
        children: [],
      }
      current.node.children.push(eachNode)
      stack.push({ node: eachNode as any })
      continue
    }

    // Check for block open
    const blockMatch = BLOCK_OPEN_RE.exec(trimmed)
    if (blockMatch && BLOCK_NAMES.has(blockMatch[1]!)) {
      const blockType = blockMatch[1]! as string
      const props = parseProps(blockMatch[2] ?? '')

      if (blockType === 'menu') {
        const menuNode: MenuNode = {
          type: 'menu',
          props,
          items: [],
        }
        current.node.children.push(menuNode)
        stack.push({ node: menuNode as any })
      } else {
        const blockNode: AstNode & { children: AstNode[] } = {
          type: blockType,
          props,
          children: [],
        } as any

        current.node.children.push(blockNode)
        stack.push({ node: blockNode })
      }
      continue
    }

    // If we're inside a menu block, add as list-item to items
    if (current.node.type === 'menu') {
      const menuNode = current.node as unknown as MenuNode
      const content = trimmed.replace(/^-\s*/, '')
      const item: ListItemNode = {
        type: 'list-item',
        content,
        segments: parseInlineSegments(content),
      }
      menuNode.items.push(item)
      continue
    }

    // --- Inline content detection ---

    // Horizontal rule
    if (RULE_RE.test(trimmed)) {
      const ruleNode: RuleNode = { type: 'rule' }
      current.node.children.push(ruleNode)
      continue
    }

    // Heading
    const headingMatch = HEADING_RE.exec(trimmed)
    if (headingMatch) {
      const level = headingMatch[1]!.length as 1 | 2 | 3
      const headingNode: HeadingNode = {
        type: 'heading',
        level,
        content: headingMatch[2]!,
      }
      current.node.children.push(headingNode)
      continue
    }

    // Font directive
    const fontMatch = FONT_DIRECTIVE_RE.exec(trimmed)
    if (fontMatch) {
      const fontNode: FontDirectiveNode = {
        type: 'font-directive',
        font: fontMatch[1]!,
      }
      current.node.children.push(fontNode)
      continue
    }

    // Blockquote
    const quoteMatch = QUOTE_RE.exec(trimmed)
    if (quoteMatch) {
      const quoteNode: QuoteNode = {
        type: 'quote',
        children: parseInlineSegments(quoteMatch[1]!) as any,
      }
      current.node.children.push(quoteNode)
      continue
    }

    // List items — accumulate consecutive lines
    const listItemMatch = LIST_ITEM_RE.exec(trimmed)
    if (listItemMatch) {
      // Check if the last child is already a list node we can append to
      const lastChild = current.node.children[current.node.children.length - 1]
      if (lastChild && lastChild.type === 'list') {
        const listNode = lastChild as ListNode
        const content = listItemMatch[1]!
        listNode.items.push({
          type: 'list-item',
          content,
          segments: parseInlineSegments(content),
        })
      } else {
        const content = listItemMatch[1]!
        const listNode: ListNode = {
          type: 'list',
          items: [
            {
              type: 'list-item',
              content,
              segments: parseInlineSegments(content),
            },
          ],
        }
        current.node.children.push(listNode)
      }
      continue
    }

    // Default: text node with inline segments
    const textNode: TextNode = {
      type: 'text',
      content: trimmed,
      segments: parseInlineSegments(trimmed),
    }
    current.node.children.push(textNode)
  }

  return root
}
