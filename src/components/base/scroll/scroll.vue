<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>

<script setup>
  import useScroll from './use-scroll'
  import { ref, defineProps } from 'vue'

  const props = defineProps({
    click: {
      type: Boolean,
      default: true
    }
  })
  const rootRef = ref(null)
  useScroll(rootRef, props)
</script>
