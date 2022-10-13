<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>

<script setup>
  import useScroll from './use-scroll'
  import { ref } from 'vue'

  // eslint-disable-next-line no-undef
  const props = defineProps({
    click: {
      type: Boolean,
      default: true
    },
    probeType: {
      type: Number,
      default: 0
    }
  })

  // eslint-disable-next-line no-undef
  const emits = defineEmits(['scroll'])

  const rootRef = ref(null)
  const { scroll } = useScroll(rootRef, props, emits)
  // eslint-disable-next-line no-undef
  defineExpose({
    scroll
  })
</script>
