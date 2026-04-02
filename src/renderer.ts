import type { Cell } from './types'
import type { Background } from './background'
import { rgbToHsl, hslToCss } from './palette'

export interface RendererOptions {
  fontSize: number
  fontFamily: string
}

// Characters ordered by visual density (light to heavy)
const DENSITY_CHARS = ' .·:;+*#@'

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
    const fontSize = this.options.fontSize
    const fontFamily = this.options.fontFamily

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = '#0a0a12'
    ctx.fillRect(0, 0, vw, vh)
    ctx.textBaseline = 'top'

    // Update background (e.g., sample new video frame)
    background.update?.(time, cols, rows)

    // Build a set of occupied cells for quick lookup
    const occupied = new Set<string>()
    for (const cell of cells) {
      if (cell.char !== ' ') {
        occupied.add(`${cell.col},${cell.row}`)
      }
    }

    // First pass: fill empty cells with background-colored density characters
    ctx.font = `400 ${fontSize}px ${fontFamily}`
    for (let row = 0; row < rows; row++) {
      const y = row * cellH
      for (let col = 0; col < cols; col++) {
        if (occupied.has(`${col},${row}`)) continue

        const [r, g, b] = background.sample(col, row, time)
        // Use max channel for uniform density across hues
        const brightness = Math.max(r, g, b) / 255
        if (brightness < 0.02) continue

        // Cube curve pushes most cells toward lighter density chars
        const b3 = brightness * brightness * brightness
        const charIdx = Math.min(
          DENSITY_CHARS.length - 1,
          Math.floor(b3 * DENSITY_CHARS.length)
        )
        const ch = DENSITY_CHARS[charIdx]!
        if (ch === ' ') continue

        const [h, s, l] = rgbToHsl(r, g, b)
        const dimL = Math.min(0.25, l * 0.4 + 0.05)
        const dimS = Math.min(1, s * 1.2)
        ctx.fillStyle = hslToCss(h, dimS, dimL)
        ctx.fillText(ch, col * cellW, y)
      }
    }

    // Second pass: draw content cells (on top of background chars)
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

      // Content text: brighter than background chars to stand out
      const boostedL = Math.min(0.7, l * 1.3 * brightnessMul + 0.25)
      const boostedS = Math.min(1, s * 1.4)

      ctx.font = `${weight} ${fontSize}px ${fontFamily}`
      ctx.fillStyle = hslToCss(h, boostedS, boostedL)
      ctx.fillText(cell.char, x, y)
    }
  }
}
