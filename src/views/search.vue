<template>
  <div class="search">
    <div class="search-input-wrapper">
      <SearchInput v-model:query="query"></SearchInput>
    </div>
  </div>
</template>

<script setup>
  import SearchInput from '@/components/search/search-input.vue'
  import { ref, watch } from 'vue'

  const query = ref('')
  watch(query, val => {
    console.log(val)
  })
</script>

<style lang="scss" scoped>
  .search {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    display: flex;
    flex-direction: column;
    .search-input-wrapper {
      padding: 20px;
    }
  }
</style>
