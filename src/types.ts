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
}
