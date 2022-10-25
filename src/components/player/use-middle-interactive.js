import { ref } from 'vue'

export default function useMiddleInteractive() {
  // 将要看到的视图
  const currentShow = ref('cd')
  const middleLStyle = ref(null)
  const middleRStyle = ref(null)

  const touch = {}
  let currentView = 'cd'

  function onMiddleTouchStart(e) {
    console.log(currentShow.value)
    console.log(currentView)
    touch.startX = e.touches[0].pageX
  }
  function onMiddleTouchMove(e) {
    console.log('onMiddleTouchMove')
    const deltaX = e.touches[0].pageX - touch.startX
    const offsetWidth =
      currentView === 'cd'
        ? Math.min(0, Math.max(-window.innerWidth, deltaX))
        : Math.min(window.innerWidth, Math.max(0, deltaX))
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
    let offsetWidth
    let opacity
    if (touch.percent > 0.5) {
      if (currentView === 'cd') {
        currentShow.value = 'lyric'
      } else {
        currentShow.value = 'cd'
      }
    }
    if (currentShow.value === 'cd') {
      currentView = 'cd'
      offsetWidth = 0
      opacity = 1
    } else {
      currentView = 'lyric'
      offsetWidth = -window.innerWidth
      opacity = 0
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
  }
  return { currentShow, middleLStyle, middleRStyle, onMiddleTouchStart, onMiddleTouchMove, onMiddleTouchEnd }
}
