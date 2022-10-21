<template>
  <div class="progress-bar" ref="progressBarRef" @click="onClick">
    <div class="bar-inner">
      <div class="progress" ref="progressRef" :style="progressStyle"></div>
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, reactive, ref, toRef, watch } from 'vue'

  // eslint-disable-next-line no-undef
  const props = defineProps({
    progress: {
      type: Number,
      default: 0
    }
  })
  // eslint-disable-next-line no-undef
  const emits = defineEmits(['progress-changing', 'progress-changed'])

  // 进度条按钮的宽度
  const progressBtnWidth = 16
  // 完整进度条组件
  const progressBarRef = ref(null)
  // 黄色进度条
  const progressRef = ref(null)
  // 偏移量
  const offset = ref(0)
  // progress发生改变，进度条也发生改变
  watch(toRef(props, 'progress'), newProgress => {
    const barWidth = progressBarRef.value.clientWidth - progressBtnWidth
    offset.value = barWidth * newProgress
  })

  // 进度条的偏移量
  const progressStyle = computed(() => `width:${offset.value}px`)
  // 按钮的偏移量
  const btnStyle = computed(() => `transform:translate3d(${offset.value}px,0,0)`)

  // 临时变量，存储有关touch的数据
  const touch = reactive({})
  // 触摸进度按钮
  function onTouchStart(e) {
    touch.x1 = e.touches[0].pageX
    touch.beginWidth = progressRef.value.clientWidth
  }
  // 移动进度按钮
  function onTouchMove(e) {
    const delta = e.touches[0].pageX - touch.x1
    const tempWidth = touch.beginWidth + delta
    const barWidth = progressBarRef.value.clientWidth - progressBtnWidth
    const progress = Math.min(1, Math.max(tempWidth / barWidth, 0))
    emits('progress-changing', progress)
  }
  // 移动进度按钮结束
  function onTouchEnd() {
    const barWidth = progressBarRef.value.clientWidth - progressBtnWidth
    const progress = progressRef.value.clientWidth / barWidth
    emits('progress-changed', progress)
  }
  // 点击进度条
  function onClick(e) {
    const rect = progressBarRef.value.getBoundingClientRect()
    const offsetWidth = e.pageX - rect.left
    const barWidth = progressBarRef.value.clientWidth - progressBtnWidth
    const progress = offsetWidth / barWidth
    emits('progress-changed', progress)
  }
</script>

<style lang="scss" scoped>
  .progress-bar {
    height: 30px;
    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
      .progress {
        position: absolute;
        height: 100%;
        background: $color-theme;
      }
      .progress-btn-wrapper {
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn {
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid $color-text;
          border-radius: 50%;
          background: $color-theme;
        }
      }
    }
  }
</style>
