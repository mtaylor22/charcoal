import { createApp, gradient } from '../../src/index'

const markup = `
sidebar width=15 align=left {
  menu bind=currentBg {
    - rainbow
    - fire
    - ocean
    - forest
  }
}

{#if scene == "title"}
  box align=center {
    # CHARCOAL

    ---

    A text UI framework for canvas.
    Everything is characters on a grid.

    row gap=4 align=center {
      [* explore *](-> goToAbout)
      [* scroll *](-> goToScroll)
    }
  }
{/if}

{#if scene == "about"}
  box border=single align=center width=50 {
    ## About

    ---

    Charcoal renders markup to a character grid.
    The grid is the document.
    Backgrounds are just styling.

    **Bold text** and *dim text* work.
    So do \`code spans\` and {expressions}.

    [* back *](-> goToTitle)
  }
{/if}

{#if scene == "scroll"}
  box align=center width=45 {
    ## The Zen of Python

    ---

    scroll height=12 {
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

const backgrounds: Record<string, () => ReturnType<typeof gradient>> = {
  rainbow: () => gradient('rainbow'),
  fire: () => gradient('linear', { from: '#ff4400', to: '#ffcc00', angle: 90 }),
  ocean: () => gradient('linear', { from: '#003366', to: '#00ccff', angle: 45 }),
  forest: () => gradient('linear', { from: '#004400', to: '#88cc44', angle: 135 }),
}

const app = createApp(markup, canvas, {
  background: gradient('rainbow'),
  fontSize: 14,
  fontFamily: '"Courier New", Courier, monospace',
})

app.state.set('scene', 'title')
app.state.set('currentBg', 'rainbow')

app.on('goToAbout', () => app.state.set('scene', 'about'))
app.on('goToScroll', () => app.state.set('scene', 'scroll'))
app.on('goToTitle', () => app.state.set('scene', 'title'))

app.state.watch('currentBg', (v: string) => {
  const factory = backgrounds[v]
  if (factory) app.setBackground(factory())
})

app.start()
