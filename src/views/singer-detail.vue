<template>
  <div class="singer-detail">
    <MusicList :songs="songs" :title="title" :pic="pic" :loading="loading"></MusicList>
  </div>
</template>

<script setup>
  import { getSingerDetail } from '@/service/singer'
  import { onMounted, ref, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { processSongs } from '@/service/song'
  import MusicList from '@/components/music-list/music-list.vue'
  import storage from 'good-storage'
  import { SINGER_KEY } from '@/assets/js/constant'

  const route = useRoute()
  const router = useRouter()
  // eslint-disable-next-line no-undef
  const props = defineProps({
    singer: Object
  })

  // 加载中
  const loading = ref(true)

  // 标题
  const title = computed(() => {
    const singer = computedSinger.value
    return singer && singer.name
  })

  // 图片
  const pic = computed(() => {
    const singer = computedSinger.value
    return singer && singer.pic
  })

  // 歌曲
  const songs = ref([])

  // 获取歌手详细信息，并处理歌曲，取消loading标识
  onMounted(async () => {
    if (!computedSinger.value) {
      const path = route.matched[0].path
      router.push({
        path: path
      })
      return
    }
    const result = await getSingerDetail(computedSinger.value)
    songs.value = await processSongs(result.songs)
    loading.value = false
  })

  // 如果通过组件传值得到singer，就使用props的singer。如果没有就用session中的singer
  const computedSinger = computed(() => {
    let ret = null
    const singer = props.singer
    if (singer) {
      ret = singer
    } else {
      const cachedSinger = storage.session.get(SINGER_KEY)
      if (cachedSinger && cachedSinger.mid === route.params.id) {
        ret = cachedSinger
      }
    }
    return ret
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
