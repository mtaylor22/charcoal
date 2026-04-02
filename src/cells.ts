// src/cells.ts

import type { LayoutNode } from './layout'
import type { Cell } from './types'
import type {
  AstNode,
  TextNode,
  HeadingNode,
  ButtonNode,
  QuoteNode,
  ListItemNode,
  MenuNode,
  BoxNode,
  TextSegment,
} from './ast'
import { renderFiglet } from './figlet'

// --- Word-wrap helper (mirrors layout.ts logic) ---

function wrapText(content: string, width: number): string[] {
  if (width <= 0) return [content]
  if (content.length === 0) return ['']
  const words = content.split(' ')
  const lines: string[] = []
  let currentLine = ''
  for (const word of words) {
    if (currentLine.length === 0) {
      currentLine = word
    } else if (currentLine.length + 1 + word.length > width) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine += ' ' + word
    }
  }
  lines.push(currentLine)
  return lines
}

// --- Scroll state ---

const scrollOffsets = new Map<LayoutNode, number>()
export type ScrollRegion = { layoutNode: LayoutNode; top: number; bottom: number; contentHeight: number }
let scrollRegions: ScrollRegion[] = []

export function getScrollRegions(): ScrollRegion[] {
  return scrollRegions
}

export function setScrollOffset(layoutNode: LayoutNode, offset: number): void {
  scrollOffsets.set(layoutNode, offset)
}

export function getScrollOffset(layoutNode: LayoutNode): number {
  return scrollOffsets.get(layoutNode) ?? 0
}

// --- Unique ID counter for buttons ---

let buttonCounter = 0

function resetButtonCounter(): void {
  buttonCounter = 0
}

function nextButtonId(): string {
  return `btn-${buttonCounter++}`
}

// --- Segment emission ---

function emitSegmentCells(
  segments: TextSegment[],
  col: number,
  row: number,
  width: number,
): Cell[] {
  const cells: Cell[] = []
  let cursorCol = col
  let cursorRow = row

  for (const seg of segments) {
    let text: string
    let font: string
    let interactive: Cell['interactive'] | undefined

    switch (seg.type) {
      case 'plain':
        text = seg.content
        font = '400 normal'
        break
      case 'bold':
        text = seg.content
        font = '800 bold'
        break
      case 'dim':
        text = seg.content
        font = '400 dim'
        break
      case 'code':
        text = seg.content
        font = '400 code'
        break
      case 'expression':
        text = seg.key
        font = '400 normal'
        break
      case 'button':
        text = seg.label
        font = '400 normal'
        interactive = { id: nextButtonId(), action: seg.action, hovered: false }
        break
      default:
        continue
    }

    for (const ch of text) {
      if (ch === ' ' && cursorCol === col && cursorCol > col) {
        // skip leading space at start of wrapped line — but this simple
        // approach just emits character by character with wrapping
      }
      if (width > 0 && cursorCol - col >= width) {
        cursorCol = col
        cursorRow++
      }
      const cell: Cell = { col: cursorCol, row: cursorRow, char: ch, font }
      if (interactive) cell.interactive = interactive
      cells.push(cell)
      cursorCol++
    }
  }

  return cells
}

// --- Main emitter ---

function emitNode(layoutNode: LayoutNode): Cell[] {
  const { node, col, row, width, height, children } = layoutNode
  const cells: Cell[] = []

  switch (node.type) {
    case 'text': {
      const text = node as TextNode
      if (text.segments && text.segments.length > 0) {
        cells.push(...emitSegmentCells(text.segments, col, row, width))
      } else {
        // Fallback: emit content with word-wrap
        const lines = wrapText(text.content, width)
        for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
          const line = lines[lineIdx]!
          for (let charIdx = 0; charIdx < line.length; charIdx++) {
            cells.push({
              col: col + charIdx,
              row: row + lineIdx,
              char: line[charIdx]!,
              font: '400 normal',
            })
          }
        }
      }
      break
    }

    case 'heading': {
      const heading = node as HeadingNode
      if (heading.level <= 2) {
        // Render as figlet ASCII art
        const block = renderFiglet(heading.content, heading.font)
        for (let lineIdx = 0; lineIdx < block.lines.length; lineIdx++) {
          const line = block.lines[lineIdx]!
          for (let charIdx = 0; charIdx < line.length; charIdx++) {
            const ch = line[charIdx]!
            if (ch === ' ') continue
            cells.push({
              col: col + charIdx,
              row: row + lineIdx,
              char: ch,
              font: '800 heading',
            })
          }
        }
      } else {
        // h3: plain bold text
        for (let i = 0; i < heading.content.length; i++) {
          cells.push({
            col: col + i,
            row,
            char: heading.content[i]!,
            font: '600 heading',
          })
        }
      }
      break
    }

    case 'rule': {
      for (let i = 0; i < width; i++) {
        cells.push({ col: col + i, row, char: '─', font: '400 normal' })
      }
      break
    }

    case 'button': {
      const btn = node as ButtonNode
      const id = nextButtonId()
      for (let i = 0; i < btn.label.length; i++) {
        cells.push({
          col: col + i,
          row,
          char: btn.label[i]!,
          font: '400 normal',
          interactive: { id, action: btn.action, hovered: false },
        })
      }
      break
    }

    case 'quote': {
      const quote = node as QuoteNode
      cells.push({ col, row, char: '│', font: '400 normal' })
      // Emit content from children
      const quoteContent = quote.children
        .map(c => {
          if ('content' in c) return (c as any).content as string
          return ''
        })
        .join('')
      for (let i = 0; i < quoteContent.length; i++) {
        cells.push({
          col: col + 2 + i,
          row,
          char: quoteContent[i]!,
          font: '400 normal',
        })
      }
      break
    }

    case 'list': {
      // Recurse into children (list-items already positioned by layout)
      for (const child of children) {
        cells.push(...emitNode(child))
      }
      break
    }

    case 'list-item': {
      const item = node as ListItemNode
      cells.push({ col, row, char: '•', font: '400 normal' })
      if (item.segments && item.segments.length > 0) {
        cells.push(...emitSegmentCells(item.segments, col + 2, row, width - 2))
      } else {
        for (let i = 0; i < item.content.length; i++) {
          cells.push({
            col: col + 2 + i,
            row,
            char: item.content[i]!,
            font: '400 normal',
          })
        }
      }
      break
    }

    case 'menu': {
      const menu = node as MenuNode
      const bindKey = menu.props.bind ?? ''
      for (let idx = 0; idx < children.length; idx++) {
        const child = children[idx]!
        const childNode = child.node as ListItemNode
        const menuId = `menu-${idx}`
        const itemValue = childNode.content
        const action = bindKey ? `menu-select:${bindKey}:${itemValue}` : 'menu-select'
        const interactive = { id: menuId, action, hovered: false }

        // Emit bullet
        cells.push({ col: child.col, row: child.row, char: '•', font: '400 normal', interactive })

        // Emit content
        if (childNode.segments && childNode.segments.length > 0) {
          const segCells = emitSegmentCells(childNode.segments, child.col + 2, child.row, child.width - 2)
          for (const c of segCells) {
            c.interactive = interactive
            cells.push(c)
          }
        } else {
          for (let i = 0; i < childNode.content.length; i++) {
            cells.push({
              col: child.col + 2 + i,
              row: child.row,
              char: childNode.content[i]!,
              font: '400 normal',
              interactive,
            })
          }
        }
      }
      break
    }

    case 'box': {
      const box = node as BoxNode
      const hasBorder = box.props.border != null && box.props.border !== 'none'
      if (hasBorder) {
        // Top row
        cells.push({ col, row, char: '+', font: '400 normal' })
        for (let i = 1; i < width - 1; i++) {
          cells.push({ col: col + i, row, char: '-', font: '400 normal' })
        }
        cells.push({ col: col + width - 1, row, char: '+', font: '400 normal' })

        // Side walls
        for (let r = 1; r < height - 1; r++) {
          cells.push({ col, row: row + r, char: '|', font: '400 normal' })
          cells.push({ col: col + width - 1, row: row + r, char: '|', font: '400 normal' })
        }

        // Bottom row
        cells.push({ col, row: row + height - 1, char: '+', font: '400 normal' })
        for (let i = 1; i < width - 1; i++) {
          cells.push({ col: col + i, row: row + height - 1, char: '-', font: '400 normal' })
        }
        cells.push({ col: col + width - 1, row: row + height - 1, char: '+', font: '400 normal' })
      }

      // Recurse into children (already positioned inside border by layout)
      for (const child of children) {
        cells.push(...emitNode(child))
      }
      break
    }

    case 'scroll': {
      // Emit children, then clip to scroll viewport and apply scroll offset
      const scrollOffset = scrollOffsets.get(layoutNode) ?? 0
      const childCells: Cell[] = []
      for (const child of children) {
        childCells.push(...emitNode(child))
      }
      // Shift by scroll offset and clip to scroll region
      const scrollTop = row
      const scrollBottom = row + height
      for (const c of childCells) {
        const adjustedRow = c.row - scrollOffset
        if (adjustedRow >= scrollTop && adjustedRow < scrollBottom) {
          cells.push({ ...c, row: adjustedRow })
        }
      }
      // Track scroll region for hit testing
      scrollRegions.push({ layoutNode, top: scrollTop, bottom: scrollBottom, contentHeight: children.reduce((s, c) => s + c.height, 0) })
      break
    }

    case 'conditional':
    case 'each':
    case 'root':
    case 'row':
    case 'col':
    case 'sidebar': {
      for (const child of children) {
        cells.push(...emitNode(child))
      }
      break
    }

    case 'font-directive': {
      // Emit nothing
      break
    }

    default: {
      // Unknown node types: try recursing into children
      for (const child of children) {
        cells.push(...emitNode(child))
      }
      break
    }
  }

  return cells
}

export function emitCells(tree: LayoutNode): Cell[] {
  resetButtonCounter()
  scrollRegions = []
  return emitNode(tree)
}
