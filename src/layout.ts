// src/layout.ts

import type {
  AstNode,
  RootNode,
  BoxNode,
  RowNode,
  ColNode,
  ScrollNode,
  SidebarNode,
  MenuNode,
  TextNode,
  HeadingNode,
  RuleNode,
  ButtonNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  FontDirectiveNode,
  ConditionalNode,
  EachNode,
} from './ast'

export type LayoutNode = {
  node: AstNode
  col: number
  row: number
  width: number
  height: number
  children: LayoutNode[]
}

// --- Word-wrap helper ---

function wrapLineCount(content: string, width: number): number {
  if (width <= 0) return 1
  if (content.length === 0) return 1
  const words = content.split(' ')
  let lines = 1
  let lineLen = 0
  for (const word of words) {
    if (lineLen === 0) {
      lineLen = word.length
    } else if (lineLen + 1 + word.length > width) {
      lines++
      lineLen = word.length
    } else {
      lineLen += 1 + word.length
    }
  }
  return lines
}

// --- Helper to get children array from any node ---

function getChildren(node: AstNode): AstNode[] {
  switch (node.type) {
    case 'root':
    case 'box':
    case 'row':
    case 'col':
    case 'scroll':
    case 'sidebar':
    case 'conditional':
    case 'each':
      return (node as any).children ?? []
    case 'quote':
      return (node as QuoteNode).children as AstNode[] ?? []
    case 'menu':
      return (node as MenuNode).items ?? []
    case 'list':
      return (node as ListNode).items ?? []
    default:
      return []
  }
}

// --- Pass 1: Size Resolution ---

function resolveSize(node: AstNode, availWidth: number, availHeight: number, parentNode?: AstNode, siblingIndex?: number, siblings?: AstNode[]): LayoutNode {
  switch (node.type) {
    case 'root': {
      const root = node as RootNode
      // Check for sidebar children to adjust available width for siblings
      const layoutChildren = resolveRootChildren(root.children, availWidth, availHeight)
      return {
        node,
        col: 0,
        row: 0,
        width: availWidth,
        height: availHeight,
        children: layoutChildren,
      }
    }

    case 'box': {
      const box = node as BoxNode
      const boxWidth = box.props.width ?? availWidth
      const hasBorder = box.props.border != null && box.props.border !== 'none'
      const padding = box.props.padding ?? 0
      let innerWidth = boxWidth
      if (hasBorder) innerWidth -= 2
      innerWidth -= padding * 2

      const children = box.children.map(c => resolveSize(c, innerWidth, availHeight))
      const childrenHeight = children.reduce((sum, c) => sum + c.height, 0)

      let boxHeight = childrenHeight
      if (hasBorder) boxHeight += 2
      boxHeight += padding * 2
      if (box.props.height != null) boxHeight = box.props.height

      return {
        node,
        col: 0,
        row: 0,
        width: boxWidth,
        height: boxHeight,
        children,
      }
    }

    case 'row': {
      const row = node as RowNode
      const gap = row.props.gap ?? 0
      const numChildren = row.children.length
      const childWidth = numChildren > 0
        ? Math.floor((availWidth - gap * (numChildren - 1)) / numChildren)
        : 0
      const children = row.children.map(c => resolveSize(c, childWidth, availHeight))
      const maxHeight = children.reduce((max, c) => Math.max(max, c.height), 0)
      return {
        node,
        col: 0,
        row: 0,
        width: availWidth,
        height: maxHeight,
        children,
      }
    }

    case 'col': {
      const col = node as ColNode
      const gap = col.props.gap ?? 0
      const children = col.children.map(c => resolveSize(c, availWidth, availHeight))
      const totalHeight = children.reduce((sum, c) => sum + c.height, 0) + gap * Math.max(0, children.length - 1)
      return {
        node,
        col: 0,
        row: 0,
        width: availWidth,
        height: totalHeight,
        children,
      }
    }

    case 'sidebar': {
      const sidebar = node as SidebarNode
      const children = sidebar.children.map(c => resolveSize(c, sidebar.props.width, availHeight))
      return {
        node,
        col: 0,
        row: 0,
        width: sidebar.props.width,
        height: availHeight,
        children,
      }
    }

    case 'scroll': {
      const scroll = node as ScrollNode
      const children = scroll.children.map(c => resolveSize(c, availWidth, scroll.props.height))
      return {
        node,
        col: 0,
        row: 0,
        width: availWidth,
        height: scroll.props.height,
        children,
      }
    }

    case 'text': {
      const text = node as TextNode
      const height = wrapLineCount(text.content, availWidth)
      return {
        node,
        col: 0,
        row: 0,
        width: availWidth,
        height,
        children: [],
      }
    }

    case 'heading': {
      return {
        node,
        col: 0,
        row: 0,
        width: availWidth,
        height: 1,
        children: [],
      }
    }

    case 'rule': {
      return {
        node,
        col: 0,
        row: 0,
        width: availWidth,
        height: 1,
        children: [],
      }
    }

    case 'button': {
      const btn = node as ButtonNode
      return {
        node,
        col: 0,
        row: 0,
        width: btn.label.length,
        height: 1,
        children: [],
      }
    }

    case 'quote': {
      return {
        node,
        col: 0,
        row: 0,
        width: availWidth,
        height: 1,
        children: [],
      }
    }

    case 'list': {
      const list = node as ListNode
      const children = list.items.map(item => resolveSize(item, availWidth, availHeight))
      return {
        node,
        col: 0,
        row: 0,
        width: availWidth,
        height: list.items.length,
        children,
      }
    }

    case 'list-item': {
      return {
        node,
        col: 0,
        row: 0,
        width: availWidth,
        height: 1,
        children: [],
      }
    }

    case 'menu': {
      const menu = node as MenuNode
      const children = menu.items.map(item => resolveSize(item, availWidth, availHeight))
      return {
        node,
        col: 0,
        row: 0,
        width: availWidth,
        height: menu.items.length,
        children,
      }
    }

    case 'conditional':
    case 'each': {
      const container = node as ConditionalNode | EachNode
      const children = container.children.map(c => resolveSize(c, availWidth, availHeight))
      const totalHeight = children.reduce((sum, c) => sum + c.height, 0)
      return {
        node,
        col: 0,
        row: 0,
        width: availWidth,
        height: totalHeight,
        children,
      }
    }

    case 'font-directive': {
      return {
        node,
        col: 0,
        row: 0,
        width: 0,
        height: 0,
        children: [],
      }
    }

    default: {
      return {
        node,
        col: 0,
        row: 0,
        width: availWidth,
        height: 1,
        children: [],
      }
    }
  }
}

// Special handling for root children: sidebars affect sibling widths
function resolveRootChildren(children: AstNode[], availWidth: number, availHeight: number): LayoutNode[] {
  const result: LayoutNode[] = []
  let sidebarWidthClaimed = 0

  // First pass: find sidebars
  for (const child of children) {
    if (child.type === 'sidebar') {
      sidebarWidthClaimed += (child as SidebarNode).props.width
    }
  }

  const contentWidth = availWidth - sidebarWidthClaimed

  for (const child of children) {
    if (child.type === 'sidebar') {
      result.push(resolveSize(child, availWidth, availHeight))
    } else {
      result.push(resolveSize(child, contentWidth, availHeight))
    }
  }

  return result
}

// --- Pass 2: Position Assignment ---

function assignPositions(layoutNode: LayoutNode, col: number, row: number, availWidth: number): void {
  const node = layoutNode.node

  switch (node.type) {
    case 'root': {
      layoutNode.col = col
      layoutNode.row = row
      // Handle sidebar positioning for root children
      assignRootChildPositions(layoutNode, col, row, availWidth)
      break
    }

    case 'box': {
      const box = node as BoxNode
      // Handle alignment
      if (box.props.align === 'center') {
        col += Math.floor((availWidth - layoutNode.width) / 2)
      } else if (box.props.align === 'right') {
        col += availWidth - layoutNode.width
      }
      layoutNode.col = col
      layoutNode.row = row

      const hasBorder = box.props.border != null && box.props.border !== 'none'
      const padding = box.props.padding ?? 0
      let innerCol = col
      let innerRow = row
      if (hasBorder) { innerCol += 1; innerRow += 1 }
      innerCol += padding
      innerRow += padding

      const innerWidth = layoutNode.children.length > 0 ? layoutNode.children[0]!.width : 0
      let cursorRow = innerRow
      for (const child of layoutNode.children) {
        assignPositions(child, innerCol, cursorRow, innerWidth)
        cursorRow += child.height
      }
      break
    }

    case 'row': {
      const rowNode = node as RowNode
      layoutNode.col = col
      layoutNode.row = row
      const gap = rowNode.props.gap ?? 0
      let cursorCol = col
      for (const child of layoutNode.children) {
        assignPositions(child, cursorCol, row, child.width)
        cursorCol += child.width + gap
      }
      break
    }

    case 'col': {
      const colNode = node as ColNode
      layoutNode.col = col
      layoutNode.row = row
      const gap = colNode.props.gap ?? 0
      let cursorRow = row
      for (const child of layoutNode.children) {
        assignPositions(child, col, cursorRow, availWidth)
        cursorRow += child.height + gap
      }
      break
    }

    default: {
      layoutNode.col = col
      layoutNode.row = row
      // Default vertical stacking for children
      let cursorRow = row
      for (const child of layoutNode.children) {
        assignPositions(child, col, cursorRow, availWidth)
        cursorRow += child.height
      }
      break
    }
  }
}

function assignRootChildPositions(layoutNode: LayoutNode, col: number, row: number, availWidth: number): void {
  // Collect sidebar info
  let leftSidebarWidth = 0
  let rightSidebarWidth = 0
  const sidebars: LayoutNode[] = []
  const nonSidebars: LayoutNode[] = []

  for (const child of layoutNode.children) {
    if (child.node.type === 'sidebar') {
      const sb = child.node as SidebarNode
      if (sb.props.align === 'right') {
        rightSidebarWidth += sb.props.width
      } else {
        leftSidebarWidth += sb.props.width
      }
      sidebars.push(child)
    } else {
      nonSidebars.push(child)
    }
  }

  // Position sidebars
  let leftCol = col
  let rightCol = col + availWidth
  for (const sb of sidebars) {
    const sbNode = sb.node as SidebarNode
    if (sbNode.props.align === 'right') {
      rightCol -= sbNode.props.width
      assignPositions(sb, rightCol, row, sbNode.props.width)
    } else {
      assignPositions(sb, leftCol, row, sbNode.props.width)
      leftCol += sbNode.props.width
    }
  }

  // Position non-sidebar children
  const contentCol = col + leftSidebarWidth
  const contentWidth = availWidth - leftSidebarWidth - rightSidebarWidth
  let cursorRow = row
  for (const child of nonSidebars) {
    assignPositions(child, contentCol, cursorRow, contentWidth)
    cursorRow += child.height
  }
}

// --- Main export ---

export function layout(ast: RootNode, cols: number, rows: number): LayoutNode {
  const tree = resolveSize(ast, cols, rows)
  assignPositions(tree, 0, 0, cols)
  return tree
}
