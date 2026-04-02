import type { Cell } from './types'
import type { Background } from './background'
import { rgbToHsl } from './palette'
import { prepareWithSegments } from '@chenglou/pretext'

export interface RendererOptions {
  fontSize: number
  fontFamily: string
}

// Full charset across multiple weights — matches the original video-ascii approach
const CHARSET = ' .,:;!+-=*#@%&abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789~^'
const WEIGHTS = [400, 600, 800] as const

type PaletteEntry = {
  char: string
  width: number
  brightness: number
  font: string
}

type LookupEntry = { char: string; font: string }

export class Renderer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private dpr = 1
  cellW = 0
  cellH = 0
  cols = 0
  rows = 0
  private lookup: LookupEntry[] = []
  private paletteBuilt = false

  // Brightness measurement canvas
  private bCanvas: HTMLCanvasElement
  private bCtx: CanvasRenderingContext2D

  constructor(canvas: HTMLCanvasElement, private options: RendererOptions) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.bCanvas = document.createElement('canvas')
    this.bCanvas.width = 28
    this.bCanvas.height = 28
    this.bCtx = this.bCanvas.getContext('2d', { willReadFrequently: true })!
  }

  private estimateBrightness(ch: string, font: string): number {
    const size = 28
    this.bCtx.clearRect(0, 0, size, size)
    this.bCtx.font = font
    this.bCtx.fillStyle = '#fff'
    this.bCtx.textBaseline = 'middle'
    this.bCtx.fillText(ch, 1, size / 2)
    const data = this.bCtx.getImageData(0, 0, size, size).data
    let sum = 0
    for (let i = 3; i < data.length; i += 4) sum += data[i]!
    return sum / (255 * size * size)
  }

  private buildPalette(): void {
    if (this.paletteBuilt) return
    const fontSize = this.options.fontSize
    const fontFamily = this.options.fontFamily

    const palette: PaletteEntry[] = []
    for (const weight of WEIGHTS) {
      const font = `${weight} ${fontSize}px ${fontFamily}`
      for (const ch of CHARSET) {
        if (ch === ' ') continue
        const prepared = prepareWithSegments(ch, font)
        const width = prepared.widths.length > 0 ? prepared.widths[0]! : 0
        if (width <= 0) continue
        const brightness = this.estimateBrightness(ch, font)
        if (brightness > 0) {
          palette.push({ char: ch, width, brightness, font })
        }
      }
    }

    // Normalize brightness
    const maxB = Math.max(...palette.map(e => e.brightness))
    if (maxB > 0) for (const e of palette) e.brightness /= maxB
    palette.sort((a, b) => a.brightness - b.brightness)

    // Build 256-entry lookup table (brightness byte -> best char+font)
    this.lookup = []
    for (let b = 0; b < 256; b++) {
      const targetB = b / 255
      if (targetB < 0.02) {
        this.lookup.push({ char: ' ', font: `400 ${fontSize}px ${fontFamily}` })
        continue
      }
      // Binary search for closest brightness
      let lo = 0, hi = palette.length - 1
      while (lo < hi) {
        const mid = (lo + hi) >> 1
        if (palette[mid]!.brightness < targetB) lo = mid + 1
        else hi = mid
      }
      // Search neighborhood for best match (brightness + width fit)
      let best = palette[lo]!
      let bestScore = Infinity
      const start = Math.max(0, lo - 12)
      const end = Math.min(palette.length, lo + 12)
      for (let i = start; i < end; i++) {
        const e = palette[i]!
        const bErr = Math.abs(e.brightness - targetB) * 2
        const wErr = Math.abs(e.width - this.cellW) / Math.max(this.cellW, 1)
        if (bErr + wErr < bestScore) { bestScore = bErr + wErr; best = e }
      }
      this.lookup.push({ char: best.char, font: best.font })
    }

    this.paletteBuilt = true
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
    // Build palette on first render (needs canvas context)
    this.buildPalette()

    const { ctx, dpr, cols, rows, cellW, cellH, lookup } = this
    const vw = this.canvas.width / dpr
    const vh = this.canvas.height / dpr

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = '#0a0a12'
    ctx.fillRect(0, 0, vw, vh)
    ctx.textBaseline = 'top'

    // Update background (e.g., sample new video frame)
    background.update?.(time, cols, rows)

    // Build lookup maps from cells
    const occupied = new Set<string>()
    const dimMap = new Map<string, number>() // "col,row" -> dim amount
    for (const cell of cells) {
      if (cell.bgModifier?.type === 'dim') {
        const key = `${cell.col},${cell.row}`
        dimMap.set(key, cell.bgModifier.amount)
      } else if (cell.char !== ' ') {
        occupied.add(`${cell.col},${cell.row}`)
      }
    }

    // First pass: fill cells with background-colored characters from palette
    // Apply dim modifier where containers overlap
    for (let row = 0; row < rows; row++) {
      const y = row * cellH
      for (let col = 0; col < cols; col++) {
        const key = `${col},${row}`
        const dimAmount = dimMap.get(key)

        // Skip cells that have content (they'll be drawn in pass 2)
        if (occupied.has(key) && dimAmount === undefined) continue

        const [r, g, b] = background.sample(col, row, time)

        if (dimAmount !== undefined) {
          // Dimmed container region — render with reduced brightness
          const dimR = r * dimAmount
          const dimG = g * dimAmount
          const dimB = b * dimAmount
          const brightness = 0.299 * dimR + 0.587 * dimG + 0.114 * dimB
          const brightnessByte = Math.min(255, brightness | 0)
          const entry = lookup[brightnessByte]
          if (entry && entry.char !== ' ') {
            const [h, s, l] = rgbToHsl(dimR, dimG, dimB)
            ctx.font = entry.font
            ctx.fillStyle = `hsl(${h * 360}, ${Math.min(100, s * 120)}%, ${Math.min(100, (l * 1.4 + 0.15) * 100)}%)`
            ctx.fillText(entry.char, col * cellW, y)
          }
          continue
        }

        // Normal background cell
        const brightness = 0.299 * r + 0.587 * g + 0.114 * b
        const brightnessByte = Math.min(255, brightness | 0)
        const entry = lookup[brightnessByte]
        if (!entry || entry.char === ' ') continue

        const [h, s, l] = rgbToHsl(r, g, b)
        ctx.font = entry.font
        ctx.fillStyle = `hsl(${h * 360}, ${Math.min(100, s * 120)}%, ${Math.min(100, (l * 1.4 + 0.15) * 100)}%)`
        ctx.fillText(entry.char, col * cellW, y)
      }
    }

    // Second pass: draw content cells (on top, using same color formula but monospace + boosted)
    for (const cell of cells) {
      if (cell.char === ' ') continue

      const x = cell.col * cellW
      const y = cell.row * cellH

      const [r, g, b] = background.sample(cell.col, cell.row, time)
      const [h, s, l] = rgbToHsl(r, g, b)

      // Determine weight from cell.font marker
      let weight = '400'
      if (cell.font.includes('bold') || cell.font.includes('800')) weight = '800'
      else if (cell.font.includes('700')) weight = '700'
      else if (cell.font.includes('600')) weight = '600'

      // Content uses same base color as background but boosted to stand out
      let lBoost = 0.15
      if (cell.font.includes('dim')) lBoost = -0.1
      if (cell.font.includes('heading')) lBoost = 0.25
      if (cell.interactive?.hovered) lBoost += 0.1

      const contentL = Math.min(0.85, (l * 1.4 + 0.15) + lBoost)
      const contentS = Math.min(1, s * 1.3)

      ctx.font = `${weight} ${this.options.fontSize}px "Courier New", Courier, monospace`
      ctx.fillStyle = `hsl(${h * 360}, ${Math.min(100, contentS * 100)}%, ${Math.min(100, contentL * 100)}%)`
      ctx.fillText(cell.char, x, y)
    }
  }
}
