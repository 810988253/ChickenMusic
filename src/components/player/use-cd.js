import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'

export default function useCd() {
  const cdRef = ref(null)
  const cdImageRef = ref(null)
  const store = useStore()
  const playing = computed(() => store.state.playing)

  // 获取播放状态
  const cdCls = computed(() => (playing.value ? 'playing' : ''))
  // 暂停时暂停旋转效果
  watch(playing, newPlaying => {
    if (!newPlaying) {
      syncTransform(cdRef.value, cdImageRef.value)
    }
  })
  // 
  function syncTransform(wrapper, inner) {
    const wrapperTransform = getComputedStyle(wrapper).transform
    const innerTransform = getComputedStyle(inner).transform
    wrapper.style.transform =
      wrapperTransform === 'none' ? innerTransform : innerTransform.concat('', wrapperTransform)
  }
  return { cdCls, cdRef, cdImageRef }
}
