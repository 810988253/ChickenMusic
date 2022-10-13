import BScroll from '@better-scroll/core'
import { onMounted, onUnmounted, ref } from 'vue'
import ObserveDom from '@better-scroll/observe-dom'

BScroll.use(ObserveDom)

export default function useScroll(wrapperRef, options, emits) {
  const scroll = ref(null)

  onMounted(() => {
    scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    })

    if (options.probeType > 0) {
      scroll.value.on('scroll', pos => {
        emits('scroll', pos)
      })
    }
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })
  return { scroll }
}
