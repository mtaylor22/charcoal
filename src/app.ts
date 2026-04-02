import { parse } from './parser'
import { layout } from './layout'
import { emitCells } from './cells'
import { Renderer } from './renderer'
import { StateStore } from './state'
import { InteractionManager } from './events'
import type { Background } from './background'
import { solid } from './background'
import type { RootNode } from './ast'
import type { Cell } from './types'

export interface AppOptions {
  background?: Background
  fonts?: Record<string, string>
  fontSize?: number
  fontFamily?: string
}

export function createApp(markup: string, canvas: HTMLCanvasElement, options: AppOptions = {}) {
  const state = new StateStore()
  const renderer = new Renderer(canvas, {
    fontSize: options.fontSize ?? 14,
    fontFamily: options.fontFamily ?? '"Courier New", Courier, monospace',
  })
  const events = new InteractionManager()
  let background: Background = options.background ?? solid('#0a0a12')
  let ast: RootNode = parse(markup)
  let cells: Cell[] = []
  let animId: number | null = null

  function relayout() {
    const { cols, rows } = renderer.resize()
    // Evaluate conditionals against current state before layout
    const evaluatedAst = evaluateAst(ast, state)
    const tree = layout(evaluatedAst, cols, rows)
    cells = emitCells(tree)
    events.update(cells)
    background.setup(cols, rows)
  }

  // Evaluate conditionals and each loops against state
  function evaluateAst(node: RootNode, state: StateStore): RootNode {
    return {
      type: 'root',
      children: evaluateChildren(node.children, state),
    }
  }

  function evaluateChildren(children: any[], state: StateStore): any[] {
    const result: any[] = []
    for (const child of children) {
      if (child.type === 'conditional') {
        const stateVal = String(state.get(child.key) ?? '')
        const matches = child.operator === '=='
          ? stateVal === child.value
          : stateVal !== child.value
        if (matches) {
          result.push(...evaluateChildren(child.children, state))
        }
      } else if (child.type === 'each') {
        const collection = state.get(child.collection)
        if (Array.isArray(collection)) {
          for (const item of collection) {
            // For each iteration, substitute {itemName.prop} in children
            // For now, just include the children once per item
            result.push(...evaluateChildren(child.children, state))
          }
        }
      } else if (child.children) {
        result.push({
          ...child,
          children: evaluateChildren(child.children, state),
        })
      } else {
        result.push(child)
      }
    }
    return result
  }

  function frame(time: number) {
    renderer.render(cells, background, time)
    animId = requestAnimationFrame(frame)
  }

  // Wire canvas mouse events
  function getGridCoords(e: MouseEvent): { col: number; row: number } {
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    return {
      col: Math.floor(x / renderer.cellW),
      row: Math.floor(y / renderer.cellH),
    }
  }

  canvas.addEventListener('mousemove', (e) => {
    const { col, row } = getGridCoords(e)
    events.hover(col, row)
    // Update cursor style
    const hit = events.hitTest(col, row)
    canvas.style.cursor = hit ? 'pointer' : 'default'
  })

  canvas.addEventListener('click', (e) => {
    const { col, row } = getGridCoords(e)
    events.click(col, row)
  })

  // Touch support
  canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0]
    if (!touch) return
    const rect = canvas.getBoundingClientRect()
    const col = Math.floor((touch.clientX - rect.left) / renderer.cellW)
    const row = Math.floor((touch.clientY - rect.top) / renderer.cellH)
    events.click(col, row)
  })

  // Resize handler
  window.addEventListener('resize', () => relayout())

  // State changes trigger relayout
  state.onChange(() => relayout())

  return {
    state,
    on: (action: string, cb: () => void) => events.on(action, cb),
    start() {
      relayout()
      animId = requestAnimationFrame(frame)
    },
    stop() {
      if (animId !== null) {
        cancelAnimationFrame(animId)
        animId = null
      }
    },
    destroy() {
      this.stop()
      background.teardown()
    },
    setMarkup(m: string) {
      ast = parse(m)
      relayout()
    },
    setBackground(bg: Background) {
      background.teardown()
      background = bg
      relayout()
    },
  }
}
