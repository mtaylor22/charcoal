# Charcoal Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a reactive text UI framework that parses a Markdown-like markup language into an AST, lays it out on a character grid, and renders each cell to canvas — colored by a pluggable background (video, solid, gradient, custom function).

**Architecture:** Four-stage pipeline: Parser -> AST -> Layout Engine -> Frame Renderer. The parser runs once, the layout engine runs on resize/state change, and the renderer runs every frame. State is a reactive key-value store. Interactions (hover, click, scroll) are resolved via a spatial index over the cell list.

**Tech Stack:** TypeScript, vitest for testing, `@chenglou/pretext` for text measurement, `figlet` for ASCII art headings, canvas 2D API for rendering.

---

### Task 1: AST Node Types

Define the full set of AST node types as TypeScript types. No logic — just the data model that the parser will produce and the layout engine will consume.

**Files:**
- Create: `src/ast.ts`
- Test: `src/__tests__/ast.test.ts`

**Step 1: Write the test**

```ts
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
```

**Step 2: Run test to verify it fails**

Run: `cd /mnt/c/dev/charcoal && npx vitest run src/__tests__/ast.test.ts`
Expected: FAIL — module `../ast` not found

**Step 3: Write the AST types**

```ts
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
  content: string        // raw text for simple lines
  segments: TextSegment[] // parsed inline markup
}

export type HeadingNode = {
  type: 'heading'
  level: 1 | 2 | 3
  content: string
  font?: string          // figlet font override
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
    background?: string
    font?: string
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
```

**Step 4: Run test to verify it passes**

Run: `cd /mnt/c/dev/charcoal && npx vitest run src/__tests__/ast.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
cd /mnt/c/dev/charcoal && git add src/ast.ts src/__tests__/ast.test.ts && git commit -m "feat: define AST node types"
```

---

### Task 2: Parser — Block Parsing

Parse the structural block syntax: `name props { children }`. Blocks can nest. Everything that isn't a block is collected as raw inline content to be parsed in Task 3.

**Files:**
- Create: `src/parser.ts`
- Test: `src/__tests__/parser.test.ts`

**Step 1: Write the failing test**

```ts
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
})
```

**Step 2: Run test to verify it fails**

Run: `cd /mnt/c/dev/charcoal && npx vitest run src/__tests__/parser.test.ts`
Expected: FAIL

**Step 3: Implement the block parser**

Build a recursive descent parser. Tokenize by lines. When a line matches `blockName props {`, push a new block node. When `}` is encountered, pop. Everything else is collected as raw text children (parsed later in Task 3).

Key function: `parse(input: string): RootNode`

Internal helpers:
- `parseBlockOpen(line)` — regex match for `name key=val key=val {`
- `parseProps(propString)` — extract key=value pairs, handle quoted values, numeric coercion
- `parseChildren(lines, index)` — recursive descent consuming lines until matching `}`

**Step 4: Run tests to verify they pass**

Run: `cd /mnt/c/dev/charcoal && npx vitest run src/__tests__/parser.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
cd /mnt/c/dev/charcoal && git add src/parser.ts src/__tests__/parser.test.ts && git commit -m "feat: block parser with nested blocks and props"
```

---

### Task 3: Parser — Inline Content & Control Flow

Parse Markdown-like inline content within blocks: headings, bold, dim, code, buttons, rules, quotes, lists, expressions. Also parse control flow: `{#if}`, `{/if}`, `{#each}`, `{/each}`.

**Files:**
- Modify: `src/parser.ts`
- Modify: `src/__tests__/parser.test.ts`

**Step 1: Write the failing tests**

Add to `parser.test.ts`:

```ts
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

  it('parses menu block with list items', () => {
    const ast = parse('menu bind=currentVideo {\n  - fire\n  - fireworks\n}')
    const menu = ast.children[0]!
    expect(menu.type).toBe('menu')
    if (menu.type === 'menu') {
      expect(menu.props.bind).toBe('currentVideo')
      expect(menu.items).toHaveLength(2)
    }
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `cd /mnt/c/dev/charcoal && npx vitest run src/__tests__/parser.test.ts`
Expected: FAIL on the new tests

**Step 3: Implement inline parsing and control flow**

Add to `parser.ts`:
- `parseInlineLine(line)` — detect heading (`#`), rule (`---`), quote (`>`), list item (`-`), font directive (`font:`), or plain text
- `parseInlineSegments(text)` — regex-based scan for `**bold**`, `*dim*`, `` `code` ``, `{expression}`, `[label](-> action)`
- `parseControlFlow(line)` — match `{#if key op "value"}`, `{/if}`, `{#each collection as item}`, `{/each}`
- Integrate into main parse loop: control flow lines create/close `ConditionalNode`/`EachNode`, inline lines create leaf nodes

**Step 4: Run tests**

Run: `cd /mnt/c/dev/charcoal && npx vitest run src/__tests__/parser.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
cd /mnt/c/dev/charcoal && git add src/parser.ts src/__tests__/parser.test.ts && git commit -m "feat: inline content and control flow parsing"
```

---

### Task 4: Layout Engine — Size Resolution

Pass 1 of layout: walk the AST top-down, assigning each node its available width. Produces `LayoutNode` wrappers around `AstNode` with `width` and `height` computed.

**Files:**
- Create: `src/layout.ts`
- Test: `src/__tests__/layout.test.ts`

**Step 1: Write the failing test**

```ts
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
    const long = 'word '.repeat(30).trim() // 30 words, ~150 chars
    const ast: RootNode = {
      type: 'root',
      children: [{ type: 'text', content: long, segments: [] }],
    }
    const result = layout(ast, 20, 24) // narrow grid forces wrapping
    expect(result.children[0]!.height).toBeGreaterThan(1)
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `cd /mnt/c/dev/charcoal && npx vitest run src/__tests__/layout.test.ts`
Expected: FAIL

**Step 3: Implement layout**

Create `src/layout.ts` with:

```ts
export type LayoutNode = {
  node: AstNode
  col: number
  row: number
  width: number
  height: number
  children: LayoutNode[]
}

export function layout(ast: RootNode, cols: number, rows: number): LayoutNode
```

Two-pass approach:
1. `resolveSize(node, availableWidth)` — top-down, assigns width, computes height
2. `assignPositions(layoutNode, col, row)` — top-down, assigns col/row based on parent flow

Text wrapping: simple word-wrap to available width (count characters, break at spaces). Figlet headings: compute height from the figlet text line count.

**Step 4: Run tests**

Run: `cd /mnt/c/dev/charcoal && npx vitest run src/__tests__/layout.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
cd /mnt/c/dev/charcoal && git add src/layout.ts src/__tests__/layout.test.ts && git commit -m "feat: layout engine with size resolution and positioning"
```

---

### Task 5: Cell Emitter

Walk the `LayoutNode` tree and emit a flat `Cell[]` list. Each leaf node produces characters at their grid positions. This is the bridge between layout and rendering.

**Files:**
- Create: `src/cells.ts`
- Test: `src/__tests__/cells.test.ts`

**Step 1: Write the failing test**

```ts
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

  it('emits rule as dash characters', () => {
    const ast: RootNode = {
      type: 'root',
      children: [{ type: 'rule' }],
    }
    const tree = layout(ast, 20, 24)
    const cells = emitCells(tree)
    expect(cells.every(c => c.char === '─')).toBe(true)
    expect(cells.length).toBe(20)
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `cd /mnt/c/dev/charcoal && npx vitest run src/__tests__/cells.test.ts`
Expected: FAIL

**Step 3: Implement cell emission**

```ts
// src/cells.ts
import type { Cell } from './types'
import type { LayoutNode } from './layout'

export function emitCells(tree: LayoutNode): Cell[]
```

Walk `LayoutNode` tree. For each leaf, produce `Cell` objects:
- `TextNode`: one cell per character, word-wrapped within `width`
- `HeadingNode`: figlet text characters (but figlet rendering deferred to Task 8 since it needs canvas)
- `RuleNode`: `─` repeated for full width
- `ButtonNode`: label characters with `interactive` flag
- `BoxNode` with border: emit border characters (`+`, `-`, `|`) around edges
- `QuoteNode`: `│` gutter + content
- `ListNode`/`ListItemNode`: `•` prefix + content
- `MenuNode`: similar to list but with interactive flags

**Step 4: Run tests**

Run: `cd /mnt/c/dev/charcoal && npx vitest run src/__tests__/cells.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
cd /mnt/c/dev/charcoal && git add src/cells.ts src/__tests__/cells.test.ts && git commit -m "feat: cell emitter produces flat cell list from layout tree"
```

---

### Task 6: State Store

Reactive key-value store. Supports `get`, `set`, `watch`. Watchers fire on change. Tracks which keys are "structural" (used in conditionals/loops) vs "display" (used in expressions).

**Files:**
- Create: `src/state.ts`
- Test: `src/__tests__/state.test.ts`

**Step 1: Write the failing test**

```ts
// src/__tests__/state.test.ts
import { describe, it, expect, vi } from 'vitest'
import { StateStore } from '../state'

describe('StateStore', () => {
  it('get and set values', () => {
    const store = new StateStore()
    store.set('x', 42)
    expect(store.get('x')).toBe(42)
  })

  it('returns undefined for unset keys', () => {
    const store = new StateStore()
    expect(store.get('missing')).toBeUndefined()
  })

  it('fires watchers on change', () => {
    const store = new StateStore()
    const cb = vi.fn()
    store.watch('x', cb)
    store.set('x', 1)
    expect(cb).toHaveBeenCalledWith(1)
  })

  it('does not fire watcher when value unchanged', () => {
    const store = new StateStore()
    store.set('x', 1)
    const cb = vi.fn()
    store.watch('x', cb)
    store.set('x', 1)
    expect(cb).not.toHaveBeenCalled()
  })

  it('unwatch removes listener', () => {
    const store = new StateStore()
    const cb = vi.fn()
    const unsub = store.watch('x', cb)
    unsub()
    store.set('x', 99)
    expect(cb).not.toHaveBeenCalled()
  })

  it('fires global onChange for any mutation', () => {
    const store = new StateStore()
    const cb = vi.fn()
    store.onChange(cb)
    store.set('a', 1)
    store.set('b', 2)
    expect(cb).toHaveBeenCalledTimes(2)
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `cd /mnt/c/dev/charcoal && npx vitest run src/__tests__/state.test.ts`
Expected: FAIL

**Step 3: Implement StateStore**

```ts
// src/state.ts
export class StateStore {
  private data = new Map<string, any>()
  private watchers = new Map<string, Set<(val: any) => void>>()
  private globalListeners = new Set<(key: string, val: any) => void>()

  get(key: string): any
  set(key: string, value: any): void
  watch(key: string, cb: (val: any) => void): () => void
  onChange(cb: (key: string, val: any) => void): () => void
}
```

**Step 4: Run tests**

Run: `cd /mnt/c/dev/charcoal && npx vitest run src/__tests__/state.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
cd /mnt/c/dev/charcoal && git add src/state.ts src/__tests__/state.test.ts && git commit -m "feat: reactive state store with watchers"
```

---

### Task 7: Background System

Pluggable background that provides `(col, row) => [r, g, b]` each frame. Implement `solid()` and `fn()` backgrounds first (no canvas dependency). `video()` and `gradient()` added in Task 9.

**Files:**
- Create: `src/background.ts`
- Test: `src/__tests__/background.test.ts`

**Step 1: Write the failing test**

```ts
// src/__tests__/background.test.ts
import { describe, it, expect } from 'vitest'
import { solid, fn, type Background } from '../background'

describe('background', () => {
  it('solid returns constant color', () => {
    const bg = solid('#ff0000')
    const sample = bg.sample(5, 5, 0)
    expect(sample).toEqual([255, 0, 0])
  })

  it('solid parses shorthand hex', () => {
    const bg = solid('#f00')
    expect(bg.sample(0, 0, 0)).toEqual([255, 0, 0])
  })

  it('fn background calls custom function', () => {
    const bg = fn((col, row, _t) => [col * 10, row * 10, 0])
    expect(bg.sample(5, 3, 0)).toEqual([50, 30, 0])
  })

  it('background has setup and teardown lifecycle', () => {
    const bg = solid('#000')
    expect(typeof bg.setup).toBe('function')
    expect(typeof bg.teardown).toBe('function')
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `cd /mnt/c/dev/charcoal && npx vitest run src/__tests__/background.test.ts`
Expected: FAIL

**Step 3: Implement background**

```ts
// src/background.ts
export type RGB = [number, number, number]

export interface Background {
  setup(cols: number, rows: number): void
  sample(col: number, row: number, time: number): RGB
  teardown(): void
  // Called each frame before sampling begins (e.g., to read video frame)
  update?(time: number, cols: number, rows: number): void
}

export function solid(hex: string): Background
export function fn(callback: (col: number, row: number, time: number) => RGB): Background
```

Hex parsing: support `#rgb` and `#rrggbb` formats.

**Step 4: Run tests**

Run: `cd /mnt/c/dev/charcoal && npx vitest run src/__tests__/background.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
cd /mnt/c/dev/charcoal && git add src/background.ts src/__tests__/background.test.ts && git commit -m "feat: pluggable background system with solid and fn types"
```

---

### Task 8: Frame Renderer

The canvas rendering loop. Takes a `Cell[]` and a `Background`, samples colors, draws characters. This is the hot loop. Also handles the brightness-to-character palette from the existing video-ascii code.

**Files:**
- Create: `src/renderer.ts`
- Create: `src/palette.ts`
- Test: `src/__tests__/palette.test.ts` (renderer needs real canvas so we test the palette logic separately)

**Step 1: Write the failing test for palette**

```ts
// src/__tests__/palette.test.ts
import { describe, it, expect } from 'vitest'
import { buildLookup, rgbToHsl } from '../palette'

describe('palette', () => {
  it('rgbToHsl converts white', () => {
    const [h, s, l] = rgbToHsl(255, 255, 255)
    expect(l).toBeCloseTo(1, 1)
    expect(s).toBeCloseTo(0, 1)
  })

  it('rgbToHsl converts pure red', () => {
    const [h, s, l] = rgbToHsl(255, 0, 0)
    expect(h).toBeCloseTo(0, 1)
    expect(s).toBeCloseTo(1, 1)
  })

  it('rgbToHsl converts pure green', () => {
    const [h, s, l] = rgbToHsl(0, 255, 0)
    expect(h).toBeCloseTo(0.333, 1)
  })

  it('rgbToHsl converts black', () => {
    const [h, s, l] = rgbToHsl(0, 0, 0)
    expect(l).toBe(0)
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `cd /mnt/c/dev/charcoal && npx vitest run src/__tests__/palette.test.ts`
Expected: FAIL

**Step 3: Implement palette and renderer**

Extract color helpers and palette building from `video-ascii.ts`:

```ts
// src/palette.ts
export function rgbToHsl(r: number, g: number, b: number): [number, number, number]
export function hslToCss(h: number, s: number, l: number): string
```

```ts
// src/renderer.ts
import type { Cell } from './types'
import type { Background } from './background'

export class Renderer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private dpr: number
  private cellW: number
  private cellH: number

  constructor(canvas: HTMLCanvasElement, options: { fontSize: number; fontFamily: string })

  resize(): { cols: number; rows: number }
  render(cells: Cell[], background: Background, time: number): void
}
```

The `render()` method:
1. Clear canvas
2. Call `background.update(time, cols, rows)` if present
3. For each cell: get `background.sample(col, row, time)`, compute HSL, tint character, `ctx.fillText`

**Step 4: Run tests**

Run: `cd /mnt/c/dev/charcoal && npx vitest run src/__tests__/palette.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
cd /mnt/c/dev/charcoal && git add src/renderer.ts src/palette.ts src/__tests__/palette.test.ts && git commit -m "feat: frame renderer and color palette helpers"
```

---

### Task 9: Video & Gradient Backgrounds

Implement `video()` and `gradient()` background types. Port the video sampling logic from `video-ascii.ts` (cover mode, canvas sampling).

**Files:**
- Create: `src/backgrounds/video.ts`
- Create: `src/backgrounds/gradient.ts`
- Modify: `src/background.ts` (re-export)

**Step 1: Write the failing test**

```ts
// src/__tests__/background-gradient.test.ts
import { describe, it, expect } from 'vitest'
import { gradient } from '../backgrounds/gradient'

describe('gradient background', () => {
  it('rainbow cycles hue across columns', () => {
    const bg = gradient('rainbow')
    bg.setup(80, 24)
    const left = bg.sample(0, 12, 0)
    const mid = bg.sample(40, 12, 0)
    const right = bg.sample(79, 12, 0)
    // Colors should differ across columns
    expect(left).not.toEqual(mid)
    expect(mid).not.toEqual(right)
  })

  it('linear gradient interpolates between two colors', () => {
    const bg = gradient('linear', { from: '#ff0000', to: '#0000ff', angle: 0 })
    bg.setup(80, 24)
    const left = bg.sample(0, 12, 0)
    const right = bg.sample(79, 12, 0)
    expect(left[0]).toBeGreaterThan(left[2]) // more red on left
    expect(right[2]).toBeGreaterThan(right[0]) // more blue on right
  })
})
```

**Step 2: Run tests, verify fail**

**Step 3: Implement**

- `gradient()`: compute colors mathematically, no canvas needed. Rainbow = HSL hue sweep. Linear = lerp between two parsed hex colors.
- `video()`: create hidden `<video>` element, sample to offscreen canvas each frame in `update()`. Port cover-mode math from existing code. Store pixel buffer, `sample()` reads from it.

**Step 4: Run tests, verify pass**

**Step 5: Commit**

```bash
cd /mnt/c/dev/charcoal && git add src/backgrounds/ src/__tests__/background-gradient.test.ts && git commit -m "feat: video and gradient background types"
```

---

### Task 10: Hit Detection & Event System

Spatial index over interactive cells. Mouse/touch event handlers that resolve to actions and fire registered callbacks.

**Files:**
- Create: `src/events.ts`
- Test: `src/__tests__/events.test.ts`

**Step 1: Write the failing test**

```ts
// src/__tests__/events.test.ts
import { describe, it, expect, vi } from 'vitest'
import { InteractionManager } from '../events'
import type { Cell } from './types'

describe('InteractionManager', () => {
  it('resolves cell hit from coordinates', () => {
    const cells: Cell[] = [
      { col: 5, row: 3, char: 'g', font: '', interactive: { id: 'btn1', action: 'go', hovered: false } },
      { col: 6, row: 3, char: 'o', font: '', interactive: { id: 'btn1', action: 'go', hovered: false } },
    ]
    const mgr = new InteractionManager()
    mgr.update(cells)
    const hit = mgr.hitTest(5, 3)
    expect(hit).toBeTruthy()
    expect(hit!.action).toBe('go')
  })

  it('returns null for miss', () => {
    const mgr = new InteractionManager()
    mgr.update([])
    expect(mgr.hitTest(0, 0)).toBeNull()
  })

  it('fires action callbacks on click', () => {
    const cells: Cell[] = [
      { col: 0, row: 0, char: 'x', font: '', interactive: { id: 'btn1', action: 'doIt', hovered: false } },
    ]
    const mgr = new InteractionManager()
    mgr.update(cells)
    const cb = vi.fn()
    mgr.on('doIt', cb)
    mgr.click(0, 0)
    expect(cb).toHaveBeenCalled()
  })

  it('hover sets and clears hovered state', () => {
    const cells: Cell[] = [
      { col: 0, row: 0, char: 'x', font: '', interactive: { id: 'btn1', action: 'go', hovered: false } },
    ]
    const mgr = new InteractionManager()
    mgr.update(cells)
    mgr.hover(0, 0)
    expect(cells[0]!.interactive!.hovered).toBe(true)
    mgr.hover(5, 5) // move away
    expect(cells[0]!.interactive!.hovered).toBe(false)
  })
})
```

**Step 2: Run tests, verify fail**

**Step 3: Implement**

```ts
// src/events.ts
export class InteractionManager {
  private index = new Map<string, Cell>()  // "col,row" -> cell
  private handlers = new Map<string, Set<() => void>>()
  private hoveredId: string | null = null

  update(cells: Cell[]): void   // rebuild index from interactive cells
  hitTest(col: number, row: number): { id: string; action: string } | null
  hover(col: number, row: number): void
  click(col: number, row: number): void
  on(action: string, cb: () => void): () => void
}
```

**Step 4: Run tests, verify pass**

**Step 5: Commit**

```bash
cd /mnt/c/dev/charcoal && git add src/events.ts src/__tests__/events.test.ts && git commit -m "feat: hit detection and event system"
```

---

### Task 11: App Orchestrator — `createApp()`

Wire everything together: parse markup, compute layout, set up renderer, bind state, handle events, run the frame loop.

**Files:**
- Create: `src/app.ts`
- Create: `src/index.ts` (public API re-exports)
- Create: `src/types.ts` (shared `Cell` type)

**Step 1: Implement `createApp`**

```ts
// src/app.ts
import { parse } from './parser'
import { layout } from './layout'
import { emitCells } from './cells'
import { Renderer } from './renderer'
import { StateStore } from './state'
import { InteractionManager } from './events'
import type { Background } from './background'

export interface AppOptions {
  background?: Background
  fonts?: Record<string, string>
  fontSize?: number
  fontFamily?: string
}

export function createApp(markup: string, canvas: HTMLCanvasElement, options: AppOptions = {}) {
  const state = new StateStore()
  const renderer = new Renderer(canvas, { ... })
  const events = new InteractionManager()
  let ast = parse(markup)
  let cells: Cell[] = []

  function relayout() {
    const { cols, rows } = renderer.resize()
    const tree = layout(ast, cols, rows)
    cells = emitCells(tree)
    events.update(cells)
  }

  function frame(time: number) {
    renderer.render(cells, options.background, time)
    requestAnimationFrame(frame)
  }

  // Wire canvas events to InteractionManager
  // Wire state.onChange to relayout (for structural changes)
  // Wire resize observer to relayout

  return {
    state,
    on: (action: string, cb: () => void) => events.on(action, cb),
    start: () => { relayout(); requestAnimationFrame(frame) },
    stop: () => { /* cancel rAF */ },
    destroy: () => { /* cleanup */ },
    setMarkup: (m: string) => { ast = parse(m); relayout() },
    setBackground: (bg: Background) => { options.background = bg },
  }
}
```

```ts
// src/index.ts
export { createApp } from './app'
export { solid, fn } from './background'
export { video } from './backgrounds/video'
export { gradient } from './backgrounds/gradient'
export type { Background } from './background'
```

**Step 2: Commit**

```bash
cd /mnt/c/dev/charcoal && git add src/app.ts src/index.ts src/types.ts && git commit -m "feat: createApp orchestrator wires all systems together"
```

---

### Task 12: Example App — Port Video-ASCII Demo

Rewrite the existing video-ascii demo using charcoal to prove the framework works end to end.

**Files:**
- Create: `examples/video-ascii/index.html`
- Create: `examples/video-ascii/main.ts`
- Create: `examples/video-ascii/vite.config.ts`

Use the markup from the design doc example. Wire up state, actions, video background switching. Verify it renders the same scenes as the original.

**Step 1: Create the example**

Port the markup and wiring code from the design doc's "Example: Current Video-ASCII Demo Rewritten" section.

**Step 2: Run it**

```bash
cd /mnt/c/dev/charcoal/examples/video-ascii && npx vite
```

Visually verify: title scene with figlet heading, menu, buttons. Click buttons to switch scenes. Scroll pane works. Video background colors characters.

**Step 3: Commit**

```bash
cd /mnt/c/dev/charcoal && git add examples/ && git commit -m "feat: port video-ascii demo to charcoal framework"
```
