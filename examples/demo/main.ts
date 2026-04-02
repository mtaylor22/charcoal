import { createApp, video, gradient, registerFont, setDefaultFigletFont } from '../../src/index'
import fontAnsiShadow from 'figlet/importable-fonts/ANSI Shadow'

// Register figlet fonts
registerFont('ANSI Shadow', fontAnsiShadow)
setDefaultFigletFont('ANSI Shadow')

const VIDEO_CATALOG: Record<string, string> = {
  fire: './13717343_2048_1080_30fps.mp4',
  fireworks: './fireworks.mp4',
  'fireworks 2': './fireworks_2.mp4',
  ink: './ink_2.mp4',
  lightning: './lightning.mp4',
  mountains: './mountains.mp4',
  parkour: './parkour.mp4',
}

const markup = `
sidebar width=20 align=left {
  box valign=center padding=1 margin=1 background=dim(0.15) {
    menu bind=currentBg {
      - fire
      - fireworks
      - fireworks 2
      - ink
      - lightning
      - mountains
      - parkour
      - rainbow
      - ocean
      - ember
    }
  }
}

{#if scene == "title"}
  box align=center valign=center padding=2 margin=2 background=dim(0.25) {
    # CHARCOAL

    ---

    A text UI framework for canvas.
    Everything is characters on a grid.

    [* credits *](-> goToCredits)
  }
{/if}

{#if scene == "credits"}
  box align=center valign=center width=52 padding=2 background=dim(0.15) {
    ## Credits

    ---

    Charcoal is built on top of pretext,
    a text layout library by Cheng Lou
    that measures and positions text
    without DOM queries.

    pretext handles the hard parts:
    character width measurement,
    line breaking, and text shaping,
    letting charcoal focus on the
    grid-to-canvas rendering pipeline.

    github.com/chenglou/pretext

    ---

    Made with figlet for ASCII art
    headings and Baloo 2 for that
    thick character density.

    [* back *](-> goToTitle)
  }
{/if}
`

const canvas = document.getElementById('canvas') as HTMLCanvasElement

// Wait for Baloo 2 font to load before starting (palette needs accurate glyph measurements)
document.fonts.ready.then(() => {
  const app = createApp(markup, canvas, {
    background: video(VIDEO_CATALOG['fire']!, { mode: 'cover' }),
    fontSize: 14,
    fontFamily: '"Baloo 2", cursive',
  })

  app.state.set('scene', 'title')
  app.state.set('currentBg', 'fire')

  app.on('goToCredits', () => app.state.set('scene', 'credits'))
  app.on('goToTitle', () => app.state.set('scene', 'title'))
  app.on('backdrop-click', () => {
    if (app.state.get('scene') !== 'title') {
      app.state.set('scene', 'title')
    }
  })

  const GRADIENT_CATALOG: Record<string, () => ReturnType<typeof gradient>> = {
    rainbow: () => gradient('rainbow'),
    ocean: () => gradient('linear', { from: '#003366', to: '#00ccff', angle: 45 }),
    ember: () => gradient('linear', { from: '#330000', to: '#ff4400', angle: 90 }),
  }

  app.state.watch('currentBg', (v: string) => {
    const videoSrc = VIDEO_CATALOG[v]
    if (videoSrc) {
      app.setBackground(video(videoSrc, { mode: 'cover' }))
    } else {
      const gradientFactory = GRADIENT_CATALOG[v]
      if (gradientFactory) app.setBackground(gradientFactory())
    }
  })

  app.start()
})
