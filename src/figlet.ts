// src/figlet.ts
// Figlet font registry and text rendering

import figlet from 'figlet'

const loadedFonts = new Map<string, boolean>()
let defaultFigletFont = 'Standard'

export function registerFont(name: string, data: string): void {
  figlet.parseFont(name, data)
  loadedFonts.set(name, true)
}

export function setDefaultFigletFont(name: string): void {
  defaultFigletFont = name
}

export function getDefaultFigletFont(): string {
  return defaultFigletFont
}

export function isFontLoaded(name: string): boolean {
  return loadedFonts.has(name)
}

export type FigletBlock = {
  lines: string[]
  width: number
  height: number
}

export function renderFiglet(text: string, fontName?: string): FigletBlock {
  const font = fontName ?? defaultFigletFont
  if (!loadedFonts.has(font)) {
    // Fallback: return plain text if font not loaded
    return { lines: [text], width: text.length, height: 1 }
  }
  const raw = figlet.textSync(text, { font }).split('\n')
  // Trim trailing empty lines
  while (raw.length > 0 && raw[raw.length - 1]!.trim() === '') raw.pop()
  const width = Math.max(...raw.map(l => l.length))
  return {
    lines: raw.map(l => l.padEnd(width)),
    width,
    height: raw.length,
  }
}
