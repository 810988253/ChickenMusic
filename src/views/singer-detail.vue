<template>
  <div class="singer-detail">
    <MusicList :songs="songs" :title="title" :pic="pic"></MusicList>
  </div>
</template>

<script setup>
  import { getSingerDetail } from '@/service/singer'
  import { onMounted, ref } from 'vue'
  import { processSongs } from '@/service/song'
  import MusicList from '@/components/music-list/music-list.vue'

  // eslint-disable-next-line no-undef
  const props = defineProps({
    singer: Object
  })

  const title = ref(props.singer.name)
  const pic = ref(props.singer.pic)
  const songs = ref([])
  onMounted(async () => {
    const result = await getSingerDetail(props.singer)
    songs.value = await processSongs(result.songs)
  })
</script>

<style lang="scss" scoped>
  .singer-detail {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
  }
</style>
