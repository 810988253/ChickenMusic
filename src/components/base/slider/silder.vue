<template>
  <div class="slider" ref="rootRef">
    <div class="slider-group">
      <div class="slider-page" v-for="item in sliders" :key="item.id">
        <a :href="item.link">
          <img :src="item.pic" />
        </a>
      </div>
    </div>
    <div class="dots-wrapper">
      <span
        class="dot"
        v-for="(item, index) in sliders"
        :key="item.id"
        :class="{ 'active': currentPageIndex === index }"
      >
      </span>
    </div>
  </div>
</template>

<script setup>
  import { defineProps } from 'vue'
  import { ref } from 'vue'
  import userSlider from './use-slider'

  defineProps({
    sliders: {
      type: Array,
      default() {}
    }
  })
  
  const rootRef = ref(null)
  let currentPageIndex = ref()
  currentPageIndex = userSlider(rootRef)
</script>

<style lang="scss" scoped>
  .slider {
    position: relative;
    min-height: 1px;
    font-size: 0;
    touch-action: pan-y;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-page {
        display: inline-block;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        a {
          display: block;
          width: 100%;
        }
        img {
          display: block;
          width: 100%;
        }
      }
    }
    .dots-wrapper {
      position: absolute;
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%);
      .dot {
        display: inline-block;
        margin: 0 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #eee;
        &.active {
          width: 20px;
          border-radius: 5px;
        }
      }
    }
  }
</style>
