export type RGB = [number, number, number]

export interface Background {
  setup(cols: number, rows: number): void
  sample(col: number, row: number, time: number): RGB
  teardown(): void
  update?(time: number, cols: number, rows: number): void
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

export function solid(hex: string): Background {
  const color = parseHex(hex)
  return {
    setup() {},
    sample() { return color },
    teardown() {},
  }
}

export function fn(callback: (col: number, row: number, time: number) => RGB): Background {
  return {
    setup() {},
    sample(col, row, time) { return callback(col, row, time) },
    teardown() {},
  }
}
