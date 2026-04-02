import type { Background, RGB } from '../background'

export interface VideoOptions {
  mode?: 'cover' | 'contain'
}

export function video(src: string, options?: VideoOptions): Background {
  const _mode = options?.mode ?? 'cover'

  const videoEl = document.createElement('video')
  videoEl.src = src
  videoEl.muted = true
  videoEl.loop = true
  videoEl.playsInline = true
  videoEl.style.display = 'none'
  document.body.appendChild(videoEl)

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  let pixels: Uint8ClampedArray | null = null
  let fitCols = 0
  let fitRows = 0
  let offsetCol = 0
  let offsetRow = 0
  let cols = 0
  let rows = 0

  // Approximate cell aspect ratio (width/height): terminal chars are ~2x tall
  const cellW = 1
  const cellH = 2

  function computeFit() {
    if (!videoEl.videoWidth || !videoEl.videoHeight) return

    const videoAspect = videoEl.videoWidth / videoEl.videoHeight
    const gridAspect = (cols * cellW) / (rows * cellH)

    if (videoAspect > gridAspect) {
      fitRows = rows
      fitCols = Math.round(rows * videoAspect * (cellH / cellW))
    } else {
      fitCols = cols
      fitRows = Math.round(cols / videoAspect * (cellW / cellH))
    }

    offsetCol = Math.floor((cols - fitCols) / 2)
    offsetRow = Math.floor((rows - fitRows) / 2)

    canvas.width = fitCols
    canvas.height = fitRows
  }

  return {
    setup(c, r) {
      cols = c
      rows = r
      videoEl.play().catch(() => {})
    },

    update(_time, c, r) {
      cols = c
      rows = r

      if (!videoEl.videoWidth || !videoEl.videoHeight) return

      computeFit()

      ctx.drawImage(videoEl, 0, 0, fitCols, fitRows)
      const imageData = ctx.getImageData(0, 0, fitCols, fitRows)
      pixels = imageData.data
    },

    sample(col, row, _time): RGB {
      if (!pixels) return [0, 0, 0]

      const sCol = col - offsetCol
      const sRow = row - offsetRow

      if (sCol < 0 || sCol >= fitCols || sRow < 0 || sRow >= fitRows) {
        return [0, 0, 0]
      }

      const idx = (sRow * fitCols + sCol) * 4
      return [pixels[idx]!, pixels[idx + 1]!, pixels[idx + 2]!]
    },

    teardown() {
      videoEl.pause()
      videoEl.remove()
      pixels = null
    },
  }
}
