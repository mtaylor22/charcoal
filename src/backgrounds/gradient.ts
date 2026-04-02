import type { Background, RGB } from '../background'

export interface GradientOptions {
  from?: string   // hex color for linear
  to?: string     // hex color for linear
  angle?: number  // degrees, 0 = left-to-right
}

function parseHex(hex: string): RGB {
  hex = hex.replace('#', '')
  if (hex.length === 3) {
    hex = hex[0]! + hex[0]! + hex[1]! + hex[1]! + hex[2]! + hex[2]!
  }
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  return [r, g, b]
}

function hslToRgb(h: number, s: number, l: number): RGB {
  if (s === 0) {
    const v = Math.round(l * 255)
    return [v, v, v]
  }

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const r = hue2rgb(p, q, h + 1 / 3)
  const g = hue2rgb(p, q, h)
  const b = hue2rgb(p, q, h - 1 / 3)

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

export function gradient(type: 'rainbow' | 'linear', options?: GradientOptions): Background {
  let cols = 0
  let rows = 0

  if (type === 'rainbow') {
    return {
      setup(c, r) { cols = c; rows = r },
      sample(col, _row, _time): RGB {
        const h = cols > 1 ? col / cols : 0
        return hslToRgb(h, 0.8, 0.5)
      },
      teardown() {},
    }
  }

  // linear gradient
  const from = parseHex(options?.from ?? '#000000')
  const to = parseHex(options?.to ?? '#ffffff')
  const angleDeg = options?.angle ?? 0

  return {
    setup(c, r) { cols = c; rows = r },
    sample(col, row, _time): RGB {
      const angleRad = (angleDeg * Math.PI) / 180
      const dx = Math.cos(angleRad)
      const dy = Math.sin(angleRad)

      // Normalize col/row to [0,1]
      const nx = cols > 1 ? col / (cols - 1) : 0
      const ny = rows > 1 ? row / (rows - 1) : 0

      // Project onto gradient direction and normalize to [0,1]
      const proj = nx * dx + ny * dy
      const minProj = Math.min(0, dx) + Math.min(0, dy)
      const maxProj = Math.max(0, dx) + Math.max(0, dy)
      const range = maxProj - minProj
      const t = range > 0 ? Math.max(0, Math.min(1, (proj - minProj) / range)) : 0

      const r: RGB = [
        Math.round(from[0] + (to[0] - from[0]) * t),
        Math.round(from[1] + (to[1] - from[1]) * t),
        Math.round(from[2] + (to[2] - from[2]) * t),
      ]
      return r
    },
    teardown() {},
  }
}
