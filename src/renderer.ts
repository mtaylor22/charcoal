import type { Cell } from './types'
import type { Background } from './background'
import { rgbToHsl, hslToCss } from './palette'

export interface RendererOptions {
  fontSize: number
  fontFamily: string
}

export class Renderer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private dpr = 1
  cellW = 0
  cellH = 0
  cols = 0
  rows = 0

  constructor(canvas: HTMLCanvasElement, private options: RendererOptions) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
  }

  resize(): { cols: number; rows: number } {
    this.dpr = window.devicePixelRatio || 1
    const vw = window.innerWidth
    const vh = window.innerHeight
    this.canvas.width = Math.round(vw * this.dpr)
    this.canvas.height = Math.round(vh * this.dpr)
    this.cellW = this.options.fontSize * 0.7
    this.cellH = this.options.fontSize * 1.4
    this.cols = Math.floor(vw / this.cellW)
    this.rows = Math.floor(vh / this.cellH)
    return { cols: this.cols, rows: this.rows }
  }

  render(cells: Cell[], background: Background, time: number): void {
    const { ctx, dpr, cols, rows, cellW, cellH } = this
    const vw = this.canvas.width / dpr
    const vh = this.canvas.height / dpr

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = '#0a0a12'
    ctx.fillRect(0, 0, vw, vh)
    ctx.textBaseline = 'top'

    // Update background (e.g., sample new video frame)
    background.update?.(time, cols, rows)

    // Draw each cell
    for (const cell of cells) {
      if (cell.char === ' ') continue

      const x = cell.col * cellW
      const y = cell.row * cellH

      // Sample background color at this cell
      const [r, g, b] = background.sample(cell.col, cell.row, time)
      const [h, s, l] = rgbToHsl(r, g, b)

      // Determine font from cell.font marker
      let weight = '400'
      let brightnessMul = 1.0
      if (cell.font.includes('bold') || cell.font.includes('800')) weight = '800'
      else if (cell.font.includes('700')) weight = '700'
      else if (cell.font.includes('600')) weight = '600'
      if (cell.font.includes('dim')) brightnessMul = 0.5
      if (cell.font.includes('heading')) brightnessMul = 1.5

      // Hover brightening
      if (cell.interactive?.hovered) brightnessMul *= 1.3

      const boostedL = Math.min(1, l * 1.8 * brightnessMul + 0.15)
      const boostedS = Math.min(1, s * 1.5)

      ctx.font = `${weight} ${this.options.fontSize}px ${this.options.fontFamily}`
      ctx.fillStyle = hslToCss(h, boostedS, boostedL)
      ctx.fillText(cell.char, x, y)
    }
  }
}
