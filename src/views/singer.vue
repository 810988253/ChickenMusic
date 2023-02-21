<template>
  <div class="singer" v-loading="!singers.length">
    <IndexList :data="singers" @select="selectSinger"></IndexList>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger"></component>
      </transition>
    </router-view>
  </div>
</template>

<script setup>
  import { getSingerList } from '@/service/singer'
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import IndexList from '../components/base/index-list/index-list.vue'
  import storage from 'good-storage'
  import { SINGER_KEY } from '@/assets/js/constant'

  const router = useRouter()

  // 歌手数据
  const singers = ref([])
  onMounted(async () => {
    const result = await getSingerList()
    singers.value = result.singers
  })

  // 选中的歌手
  const selectedSinger = ref(null)
  //选中歌手事件
  function selectSinger(singer) {
    selectedSinger.value = singer
    cacheSinger(singer)
    router.push({
      path: `/singer/${singer.mid}`
    })
  }
  // 缓存当前歌手
  function cacheSinger(singer) {
    storage.session.set(SINGER_KEY, singer)
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
