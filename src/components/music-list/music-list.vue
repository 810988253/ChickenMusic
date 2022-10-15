<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgImageStyle" ref="bgImageRef">
      <div class="filter" :style="filterStyle"></div>
    </div>
    <Scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      v-no-result="noResult"
      :probe-type="3"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <SongList :songs="songs"></SongList>
      </div>
    </Scroll>
  </div>
</template>

<script setup>
  import SongList from '@/components/base/song-list/song-list.vue'
  import Scroll from '@/components/base/scroll/scroll.vue'
  import { ref, onMounted, computed } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  // eslint-disable-next-line no-undef
  const props = defineProps({
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    title: String,
    pic: String,
    loading: Boolean
  })

  // 标题的高度
  const RESERVED_HEIGHT = 40
  // scroll最大滚动距离
  const maxTranslateY = ref(0)
  // scroll滚动的距离
  const scrollY = ref(0)
  // 获取scroll组件滚动距离
  function onScroll(pos) {
    scrollY.value = -pos.y
  }

  // 动态设置背景图片的css样式
  const bgImageStyle = computed(() => {
    const scrollYVal = scrollY.value
    let zIndex = 0
    let paddingTop = '70%'
    let height = 0
    let translateZ = 0

    // 当滚动超过标题时，使标题层的zIndex值大于列表层以达到盖住列表层的效果，同时将其高度设为标题层的高度
    if (scrollYVal > maxTranslateY.value) {
      zIndex = 10
      paddingTop = 0
      height = `${RESERVED_HEIGHT}px`
      translateZ = 1
    }
    // 下拉列表，图片缩放
    let scale = 1
    if (scrollYVal < 0) {
      scale = 1 + Math.abs(scrollYVal / imageHeight.value)
    }

    return {
      zIndex,
      paddingTop,
      height,
      transform: `scale(${scale}) translateZ(${translateZ}px)`,
      backgroundImage: `url(${props.pic})`
    }
  })

  // 图片高度
  const imageHeight = ref(0)
  // 图片DOM节点的ref
  const bgImageRef = ref(null)
  // 列表Top等于图片的实际高度
  const scrollStyle = ref(null)

  onMounted(() => {
    // 获取图片实际高度
    imageHeight.value = bgImageRef.value.clientHeight
    // 图片实际高度-标题高度，就是scroll能滚动的最大距离
    maxTranslateY.value = imageHeight.value - RESERVED_HEIGHT
    // Top值设置
    scrollStyle.value = { top: `${imageHeight.value}px` }
  })

  // 图片模糊效果
  const filterStyle = computed(() => {
    let blur = 0
    const scrollYVal = scrollY.value
    const imageHeightVal = imageHeight.value
    if (scrollYVal >= 0) {
      blur = Math.min(scrollYVal / imageHeightVal, maxTranslateY.value / imageHeightVal) * 20
    }
    return {
      backdropFilter: `blur(${blur}px)`
    }
  })

  const noResult = computed(() => {
    return !props.loading && !props.songs.length
  })
  // 返回按钮
  function goBack() {
    router.back()
  }
</script>

<style lang="scss" scoped>
  .music-list {
    position: relative;
    height: 100%;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 20;
      transform: translateZ(2px);
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .title {
      position: absolute;
      top: 0;
      left: 9%;
      width: 80%;
      z-index: 20;
      transform: translateZ(2px);
      @include no-wrap();
      text-align: center;
      line-height: 40px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .bg-image {
      position: relative;
      width: 100%;
      transform-origin: top;
      background-size: cover;
      .play-btn-wrapper {
        position: absolute;
        bottom: 20px;
        z-index: 10;
        width: 100%;
        .play-btn {
          box-sizing: border-box;
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid $color-theme;
          color: $color-theme;
          border-radius: 100px;
          font-size: 0;
        }
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4);
      }
    }
    .list {
      position: absolute;
      bottom: 0;
      width: 100%;
      z-index: 0;
      .song-list-wrapper {
        padding: 20px 30px;
        background: $color-background;
      }
    }
  }
</style>
