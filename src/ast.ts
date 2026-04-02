// src/ast.ts

// --- Inline nodes (leaf content) ---

export type TextSegment =
  | { type: 'plain'; content: string }
  | BoldNode
  | DimNode
  | CodeNode
  | ExpressionNode
  | ButtonNode

export type TextNode = {
  type: 'text'
  content: string
  segments: TextSegment[]
}

export type HeadingNode = {
  type: 'heading'
  level: 1 | 2 | 3
  content: string
  font?: string
}

export type FontDirectiveNode = {
  type: 'font-directive'
  font: string
}

export type BoldNode = { type: 'bold'; content: string }
export type DimNode = { type: 'dim'; content: string }
export type CodeNode = { type: 'code'; content: string }
export type ExpressionNode = { type: 'expression'; key: string }

export type RuleNode = { type: 'rule' }

export type ButtonNode = {
  type: 'button'
  label: string
  action: string
}

export type QuoteNode = {
  type: 'quote'
  children: InlineNode[]
}

export type ListNode = {
  type: 'list'
  items: ListItemNode[]
}

export type ListItemNode = {
  type: 'list-item'
  content: string
  segments: TextSegment[]
}

// --- Block nodes (structural) ---

export type BoxNode = {
  type: 'box'
  props: {
    border?: 'single' | 'double' | 'heavy' | 'none'
    align?: 'left' | 'center' | 'right'
    width?: number
    height?: number
    padding?: number
    margin?: number
    background?: string
    font?: string
    valign?: 'top' | 'center' | 'bottom'
  }
  children: AstNode[]
}

export type RowNode = {
  type: 'row'
  props: {
    gap?: number
    align?: 'left' | 'center' | 'right'
  }
  children: AstNode[]
}

export type ColNode = {
  type: 'col'
  props: {
    gap?: number
    align?: 'left' | 'center' | 'right'
  }
  children: AstNode[]
}

export type ScrollNode = {
  type: 'scroll'
  props: {
    height: number
  }
  children: AstNode[]
}

export type SidebarNode = {
  type: 'sidebar'
  props: {
    width: number
    align?: 'left' | 'right'
  }
  children: AstNode[]
}

export type MenuNode = {
  type: 'menu'
  props: {
    bind?: string
  }
  items: ListItemNode[]
}

// --- Control flow ---

export type ConditionalNode = {
  type: 'conditional'
  key: string
  operator: '==' | '!='
  value: string
  children: AstNode[]
}

export type EachNode = {
  type: 'each'
  collection: string
  itemName: string
  children: AstNode[]
}

// --- Root ---

export type RootNode = {
  type: 'root'
  children: AstNode[]
}

// --- Union types ---

export type InlineNode = TextNode | BoldNode | DimNode | CodeNode | ExpressionNode | ButtonNode
export type BlockNode = BoxNode | RowNode | ColNode | ScrollNode | SidebarNode | MenuNode
export type ControlNode = ConditionalNode | EachNode

export type AstNode =
  | RootNode
  | BlockNode
  | ControlNode
  | TextNode
  | HeadingNode
  | FontDirectiveNode
  | RuleNode
  | ButtonNode
  | QuoteNode
  | ListNode
  | ListItemNode
