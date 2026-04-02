// src/types.ts

export type Cell = {
  col: number
  row: number
  char: string
  font: string
  interactive?: {
    id: string
    action: string
    hovered: boolean
  }
  // Background modifier for this cell's region (e.g., dim(0.3))
  bgModifier?: {
    type: 'dim'
    amount: number
  }
}
