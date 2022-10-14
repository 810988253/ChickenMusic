<template>
  <div class="singer" v-loading="!singers.length">
    <IndexList :data="singers" @select="selectSinger"></IndexList>
    <router-view :singer="selectedSinger"></router-view>
  </div>
</template>

<script setup>
  import { getSingerList } from '@/service/singer'
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import IndexList from '../components/base/index-list/index-list.vue'

  const router = useRouter()

  const singers = ref([])
  onMounted(async () => {
    const result = await getSingerList()
    singers.value = result.singers
  })

  const selectedSinger = ref(null)
  //选中歌手事件
  function selectSinger(singer) {
    selectedSinger.value = singer
    router.push({
      path: `/singer/${singer.mid}`
    })
  }
</script>

<style lang="scss" scoped>
  .singer {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
  }
</style>
