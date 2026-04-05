# charcoal

Render `.coal` markup to a character grid on canvas. Backgrounds become ASCII art. Text becomes UI.

**[Live Demo](https://mtaylor22.github.io/charcoal/)**

## What is this?

Charcoal is a framework for building text-based UIs that render to an HTML canvas. The grid is the document — every cell is a character. Backgrounds (video, gradients, solid colors) are just styling on the surface, coloring each character by sampling the underlying pixels.

```
box align=center valign=center padding=2 background=dim(0.25) {
  # HELLO WORLD

  ---

  This is a .coal file.
  Everything here renders as characters on a grid.

  [* click me *](-> doSomething)
}
```

## Features

- **`.coal` markup language** — a Markdown-like syntax with structural blocks for layout
- **Video backgrounds** — video frames sampled to the character grid, each cell colored by the underlying pixel
- **Gradient backgrounds** — rainbow, linear, or custom function backgrounds
- **Figlet headings** — `# Title` renders as ASCII art using figlet fonts
- **Transparent containers** — `background=dim(0.2)` creates dark overlays where the video shows through
- **Reactive state** — conditionals (`{#if}`) and menus (`bind=key`) driven by a key-value store
- **Shimmer effects** — ambient diagonal light sweep across content text
- **Full character palette** — 80+ characters across 3 font weights, measured for pixel density, matched to brightness
- **Hit detection** — buttons, menus, and click-outside-to-close, all on a canvas with no DOM

## Architecture

```
.coal file → Parser → AST → Layout Engine → Cell List → Renderer
                                                            ↑
                                                    Background (video/gradient/solid)
                                                    samples color per cell per frame
```

**Parser** — Reads `.coal` markup into an AST. Two modes: block syntax (`box props { }`) and inline Markdown (`# heading`, `**bold**`, `[button](-> action)`).

**Layout Engine** — Two-pass: size resolution (top-down width assignment, word wrapping) then position assignment (vertical/horizontal stacking, centering, margin/padding).

**Cell Emitter** — Walks the layout tree, produces a flat `Cell[]` array. Each cell knows its grid position, character, font weight, and interaction state.

**Renderer** — Every frame: sample the background at each cell position, pick a character from the brightness palette, color it with the pixel's HSL. Content cells render on top in monospace with boosted brightness.

## Quick Start

```ts
import { createApp, video, registerFont, setDefaultFigletFont } from 'charcoal'
import fontAnsiShadow from 'figlet/importable-fonts/ANSI Shadow'
import markup from './app.coal?raw'

registerFont('ANSI Shadow', fontAnsiShadow)
setDefaultFigletFont('ANSI Shadow')

const app = createApp(markup, document.querySelector('canvas'), {
  background: video('./fire.mp4', { mode: 'cover' }),
  fontSize: 14,
  fontFamily: '"Baloo 2", cursive',
})

app.state.set('scene', 'title')
app.on('myAction', () => app.state.set('scene', 'other'))
app.start()
```

## `.coal` Syntax

### Blocks

```
box border=single align=center width=50 padding=2 margin=1 background=dim(0.2) {
  Content goes here.
}

row gap=4 align=center {
  [* left *](-> actionA)
  [* right *](-> actionB)
}

sidebar width=20 align=left {
  menu bind=selectedItem {
    - option one
    - option two
  }
}

scroll height=14 {
  Long scrollable content...
}
```

### Inline

```
# h1 — renders as figlet ASCII art
## h2 — BOLD UPPERCASE
### h3 — bold text

**bold** *dim* `code`

---

> blockquote with gutter

- list item
- another item

[* button label *](-> actionName)

{stateKey} — dynamic value from state
```

### Conditionals

```
{#if scene == "title"}
  Content shown when scene is "title"
{/if}

{#each items as item}
  - {item.label}
{/each}
```

### Backgrounds

```ts
// Video — sampled to grid, cover mode
background: video('./fire.mp4', { mode: 'cover' })

// Gradient
background: gradient('rainbow')
background: gradient('linear', { from: '#003366', to: '#00ccff', angle: 45 })

// Solid color
background: solid('#0a0a12')

// Custom function
background: fn((col, row, time) => [r, g, b])
```

Block-level dimming in markup:

```
box background=dim(0.2) {
  Video shows through at 20% brightness
}
```

## API

```ts
const app = createApp(markup, canvas, {
  background?,    // Background source
  fonts?,         // Record<string, string> — figlet font data
  fontSize?,      // Base font size (default 14)
  fontFamily?,    // Font for background chars (default Courier New)
})

app.state.set(key, value)      // Set state
app.state.get(key)             // Read state
app.state.watch(key, callback) // React to changes
app.on(action, handler)        // Handle button/menu actions
app.setBackground(bg)          // Swap background
app.setMarkup(markup)          // Hot-swap markup
app.start()                    // Begin render loop
app.stop()                     // Pause
app.destroy()                  // Clean up
```

## Built With

- **[pretext](https://github.com/chenglou/pretext)** — text layout without DOM queries (character measurement, line breaking)
- **[figlet](https://github.com/patorjk/figlet.js)** — ASCII art text rendering
- **[Baloo 2](https://fonts.google.com/specimen/Baloo+2)** — the thick display font that makes the character palette so dense

## License

ISC
