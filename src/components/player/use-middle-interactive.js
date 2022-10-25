import { ref } from 'vue'

export default function useMiddleInteractive() {
  const currentView = ref('cd')
  const middleLStyle = ref(null)
  const middleRStyle = ref(null)

  const touch = {}

  let moved = false

  function onMiddleTouchStart(e) {
    touch.startX = e.touches[0].pageX
    touch.startY = e.touches[0].pageY
    touch.directionLock = ''
  }
  function onMiddleTouchMove(e) {
    moved = true
    const deltaX = e.touches[0].pageX - touch.startX
    const deltaY = e.touches[0].pageY - touch.startY

    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    if (!touch.directionLock) {
      touch.directionLock = absDeltaX >= absDeltaY ? 'h' : 'v'
    }
    if (touch.directionLock === 'v') {
      return
    }

    const left = currentView.value === 'cd' ? 0 : -window.innerWidth
    const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
    touch.percent = Math.abs(offsetWidth / window.innerWidth)
    middleLStyle.value = {
      opacity: 1 - touch.percent,
      transitionDuration: '0ms'
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px,0,0)`,
      transitionDuration: '0ms'
    }
  }
  function onMiddleTouchEnd() {
    if (!moved) {
      return
    }
    let offsetWidth
    let opacity
    if (currentView.value === 'cd') {
      if (touch.percent > 0.5) {
        currentView.value = 'lyric'
        offsetWidth = -window.innerWidth
        opacity = 0
      } else {
        offsetWidth = 0
        opacity = 1
      }
    } else {
      if (touch.percent < 0.5) {
        currentView.value = 'cd'
        offsetWidth = 0
        opacity = 1
      } else {
        offsetWidth = -window.innerWidth
        opacity = 0
      }
    }

    const duration = 300
    middleLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px,0,0)`,
      transitionDuration: `${duration}ms`
    }
    moved = false
  }
  return { currentView, middleLStyle, middleRStyle, onMiddleTouchStart, onMiddleTouchMove, onMiddleTouchEnd }
}
