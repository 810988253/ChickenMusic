<template>
  <div class="search-input">
    <i class="icon-search"> </i>
    <input class="input-inner" v-model.trim="inputVal" @input="handleQuery(inputVal)" />
    <i class="icon-dismiss" v-show="inputVal" @click="clear"></i>
  </div>
</template>

<script setup>
  import { debounce } from 'throttle-debounce'
  import { ref, watch } from 'vue'

  const props = defineProps({
    query: String
  })
  const emit = defineEmits(['update:query'])

  const handleQuery = debounce(300, val => {
    emit('update:query', val)
  })

  const inputVal = ref()
  watch(
    props,
    () => {
      inputVal.value = props.query
    },
    { immediate: true }
  )

  function clear() {
    inputVal.value = ''
  }
</script>

<style lang="scss" scoped>
  .search-input {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 32px;
    background: $color-highlight-background;
    border-radius: 6px;
    .icon-search {
      font-size: 24px;
      color: $color-text-d;
    }
    .input-inner {
      flex: 1;
      margin: 0 5px;
      line-height: 18px;
      background: $color-highlight-background;
      color: $color-text;
      font-size: $font-size-medium;
      outline: 0;
      &::placeholder {
        color: $color-text-d;
      }
    }
    .icon-dismiss {
      font-size: 16px;
      color: $color-text-d;
    }
  }
</style>
