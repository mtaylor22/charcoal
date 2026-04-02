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
    menu bind=currentVideo {
      - fire
      - fireworks
      - fireworks 2
      - ink
      - lightning
      - mountains
      - parkour
    }
  }
}

{#if scene == "title"}
  box align=center valign=center padding=2 background=dim(0.25) {
    # CHARCOAL

    ---

    A text UI framework for canvas.
    Everything is characters on a grid.

    row gap=4 align=center {
      [* continue *](-> goToZen)
      [* scroll *](-> goToScroll)
    }
  }
{/if}

{#if scene == "zen"}
  box align=center valign=center width=60 padding=2 background=dim(0.15) {
    ## The Zen of Python, by Tim Peters

    ---

    > Beautiful is better than ugly.
    > Explicit is better than implicit.
    > Simple is better than complex.
    > Complex is better than complicated.
    > Flat is better than nested.
    > Sparse is better than dense.
    > Readability counts.
    > Special cases aren't special enough to break the rules.
    > Although practicality beats purity.
    > Errors should never pass silently.
    > Unless explicitly silenced.
    > In the face of ambiguity, refuse the temptation to guess.
    > There should be one obvious way to do it.
    > Now is better than never.
    > Although never is often better than right now.
    > If the implementation is hard to explain, it's a bad idea.
    > If the implementation is easy to explain, it may be a good idea.
    > Namespaces are one honking great idea.

    [* back *](-> goToTitle)
  }
{/if}

{#if scene == "scroll"}
  box align=center valign=center width=45 padding=2 background=dim(0.15) {
    ## Scrollable Pane

    ---

    scroll height=14 {
      > Beautiful is better than ugly.
      > Explicit is better than implicit.
      > Simple is better than complex.
      > Complex is better than complicated.
      > Flat is better than nested.
      > Sparse is better than dense.
      > Readability counts.
      > Special cases aren't special enough to break the rules.
      > Although practicality beats purity.
      > Errors should never pass silently.
      > Unless explicitly silenced.
      > In the face of ambiguity, refuse the temptation to guess.
      > There should be one obvious way to do it.
      > Now is better than never.
      > Although never is often better than right now.
      > If the implementation is hard to explain, it's a bad idea.
      > If the implementation is easy to explain, it may be a good idea.
      > Namespaces are one honking great idea.
    }

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
  app.state.set('currentVideo', 'fire')

  app.on('goToZen', () => app.state.set('scene', 'zen'))
  app.on('goToScroll', () => app.state.set('scene', 'scroll'))
  app.on('goToTitle', () => app.state.set('scene', 'title'))

  app.state.watch('currentVideo', (v: string) => {
    const src = VIDEO_CATALOG[v]
    if (src) app.setBackground(video(src, { mode: 'cover' }))
  })

  app.start()
})
