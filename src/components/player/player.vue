<template>
  <div class="player">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img :src="currentSong.pic" />
      </div>
      <div class="top">
        <div class="back" @click="goBack">
          <i class="icon-back"></i>
        </div>
        <h1 class="title">{{ currentSong.name }}</h1>
        <h2 class="subtitle">{{ currentSong.singer }}</h2>
      </div>
      <div
        class="middle"
        @touchstart.prevent="onMiddleTouchStart"
        @touchmove.prevent="onMiddleTouchMove"
        @touchend.prevent="onMiddleTouchEnd"
      >
        <div class="middle-l" :style="middleLStyle">
          <div class="cd-wrapper">
            <div class="cd" ref="cdRef">
              <img ref="cdImageRef" :src="currentSong.pic" class="image" :class="cdCls" />
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">{{ playingLyric }}</div>
          </div>
        </div>
        <Scroll class="middle-r" ref="lyricScrollRef" :style="middleRStyle">
          <div class="lyric-wrapper">
            <div v-if="currentLyric" ref="lyricListRef">
              <p
                class="text"
                v-for="(line, index) in currentLyric.lines"
                :key="line.num"
                :class="{ 'current': currentLineNum === index }"
              >
                {{ line.txt }}
              </p>
            </div>
            <div class="pure-music" v-show="pureMusicLyric">
              <p>{{ pureMusicLyric }}</p>
            </div>
          </div>
        </Scroll>
      </div>
      <div class="bottom">
        <div class="dot-wrapper">
          <span class="dot" :class="{ 'active': currentView === 'cd' }"></span>
          <span class="dot" :class="{ 'active': currentView === 'lyric' }"></span>
        </div>
        <div class="progress-wrapper">
          <span class="time time-l">{{ formatTime(currentTime) }}</span>
          <div class="progress-bar-wrapper">
            <ProgressBar
              ref="barRef"
              :progress="progress"
              @progress-changing="onProgressChanging"
              @progress-changed="onProgressChanged"
            >
            </ProgressBar>
          </div>
          <span class="time time-l">{{ formatTime(currentSong.duration) }}</span>
        </div>
        <div class="operators">
          <div class="icon i-left">
            <i :class="modeIcon" @click="changeMode"></i>
          </div>
          <div class="icon i-left" :class="disableCls">
            <i @click="prev" class="icon-prev"></i>
          </div>
          <div class="icon i-center">
            <i @click="togglePlay" :class="playIcon"></i>
          </div>
          <div class="icon i-right" :class="disableCls">
            <i @click="next" class="icon-next"></i>
          </div>
          <div class="icon i-right">
            <i :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
          </div>
        </div>
      </div>
    </div>
    <MiniPlayer :progress="progress" :toggle-play="togglePlay"></MiniPlayer>
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script setup>
  import { useStore } from 'vuex'
  import { computed, watch, ref, nextTick } from 'vue'
  import useMode from './use-mode'
  import useCd from './use-cd'
  import useFavorite from './use-favorite'
  import ProgressBar from './progress-bar.vue'
  import { formatTime } from '@/assets/js/util'
  import { PLAY_MODE } from '@/assets/js/constant'
  import useLyric from './use-lyric'
  import Scroll from '../base/scroll/scroll.vue'
  import useMiddleInteractive from './use-middle-interactive'
  import MiniPlayer from './mini-player.vue'

  const store = useStore()
  const fullScreen = computed(() => store.state.fullScreen)
  const currentSong = computed(() => store.getters.currentSong)

  // 播放节点
  const audioRef = ref(null)
  // 播放歌曲变化，音频变化
  watch(currentSong, newSong => {
    if (!newSong.id || !newSong.url) {
      return
    }
    currentTime.value = 0
    // 切换歌曲时，歌曲应是未缓冲完成的状态，以免继续切换报错
    songReady.value = false
    const audioEl = audioRef.value
    audioEl.src = newSong.url
    audioEl.play()
    store.commit('setPlayingState', true)
  })

  // 缩小播放器
  function goBack() {
    store.commit('setFullScreen', false)
  }

  // 是否在播放中
  const playing = computed(() => store.state.playing)

  // 依据是否在播放中切换图标
  const playIcon = computed(() => {
    return playing.value ? 'icon-pause' : 'icon-play'
  })

  // 点击图标后切换播放状态
  function togglePlay() {
    store.commit('setPlayingState', !playing.value)
  }

  // 监测播放状态，切换音频的播放或暂停
  watch(playing, newPlaying => {
    if (!songReady.value) {
      return
    }
    const audioEl = audioRef.value
    if (newPlaying) {
      audioEl.play()
      playLyric()
    } else {
      audioEl.pause()
      stopLyric()
    }
  })

  // 电脑待机或合盖后，停止播放，原生DOM事件pause
  function pause() {
    store.commit('setPlayingState', false)
  }

  // 当前播放歌曲的索引
  const currentIndex = computed(() => store.state.currentIndex)
  // 当前播放列表
  const playlist = computed(() => store.state.playlist)

  // 上一首歌
  function prev() {
    const list = playlist.value
    if (!songReady.value || !list.length) {
      return
    }
    if (list.length === 1) {
      loop()
    } else {
      let index = currentIndex.value - 1
      if (index === -1) {
        index = list.length - 1
      }
      store.commit('setCurrentIndex', index)
    }
  }

  // 下一首歌
  function next() {
    const list = playlist.value
    // 如果歌曲未缓冲完成就不能点击下一首
    if (!songReady.value || !list.length) {
      return
    }
    if (list.length === 1) {
      loop()
    } else {
      let index = currentIndex.value + 1
      if (index === list.length) {
        index = 0
      }
      store.commit('setCurrentIndex', index)
    }
  }

  // 循环播放
  function loop() {
    const audioEl = audioRef.value
    audioEl.currentTime = 0
    audioEl.play()
    store.commit('setPlayingState', true)
  }

  // 歌曲是否缓冲完成
  const songReady = ref(false)

  // 歌曲缓冲完成就正常显示按钮，未完成就调暗亮度
  const disableCls = computed(() => {
    return songReady.value ? '' : 'disable'
  })

  // 歌曲缓冲完成，置为true
  function ready() {
    if (songReady.value === true) {
      return
    }
    songReady.value = true
    playLyric()
  }

  // 歌曲出错，重置为准备好，可以切换上一首或下一首
  function error() {
    songReady.value = true
  }

  // 切换播放模式按钮，更改模式函数
  const { modeIcon, changeMode } = useMode()
  // 喜欢按钮，喜欢或取消喜欢
  const { getFavoriteIcon, toggleFavorite } = useFavorite()

  // 歌曲当前时间
  const currentTime = ref(0)
  // 随着歌曲播放currentTime变化，progress变化
  const progress = computed(() => {
    return currentTime.value / currentSong.value.duration
  })
  let progressChanging = false
  // 原生DOM事件触发updateTime事件，更新当前时间
  function updateTime(e) {
    if (!progressChanging) {
      currentTime.value = e.target.currentTime
    }
  }
  function onProgressChanging(progress) {
    progressChanging = true
    currentTime.value = currentSong.value.duration * progress
    playLyric()
    stopLyric()
  }
  function onProgressChanged(progress) {
    progressChanging = false
    audioRef.value.currentTime = currentTime.value = currentSong.value.duration * progress
    playLyric()
  }

  const playMode = computed(() => store.state.playMode)
  function end() {
    currentTime.value = 0
    if (playMode.value === PLAY_MODE.loop) {
      loop()
    } else {
      next()
    }
  }

  const { cdCls, cdRef, cdImageRef } = useCd()

  const {
    currentLyric,
    currentLineNum,
    playLyric,
    lyricListRef,
    lyricScrollRef,
    stopLyric,
    pureMusicLyric,
    playingLyric
  } = useLyric({
    songReady,
    currentTime
  })

  const { currentView, middleLStyle, middleRStyle, onMiddleTouchStart, onMiddleTouchMove, onMiddleTouchEnd } =
    useMiddleInteractive()
  const barRef = ref(null)
  watch(fullScreen, async newfullScreen => {
    if (newfullScreen) {
      await nextTick()
      barRef.value.setOffset(progress.value)
    }
  })
</script>

<style lang="scss" scoped>
  .player {
    .normal-player {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background: $color-background;
      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);

        img {
          width: 100%;
          height: 100%;
        }
      }
      .top {
        position: relative;
        margin-bottom: 25px;
        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;
        }
        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
        .title {
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          @include no-wrap();
          font-size: $font-size-large;
          color: $color-text;
        }
        .subtitle {
          line-height: 20px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text;
        }
      }
      .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        .middle-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            box-sizing: border-box;
            height: 100%;
            .cd {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              img {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                border-radius: 50%;
                border: 10px solid rgba(255, 255, 255, 0.1);
              }
              .playing {
                animation: rotate 20s linear infinite;
              }
            }
          }
          .playing-lyric-wrapper {
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric {
              height: 20px;
              line-height: 20px;
              font-size: $font-size-medium;
              color: $color-text-l;
            }
          }
        }
        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text {
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
              &.current {
                color: $color-text;
              }
            }
            .pure-music {
              padding-top: 50%;
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
            }
          }
        }
      }
      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper {
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;
            &.active {
              width: 20px;
              border-radius: 5px;
              background: $color-text-ll;
            }
          }
        }
        .progress-wrapper {
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0px auto;
          padding: 10px 0;
          .time {
            color: $color-text;
            font-size: $font-size-small;
            flex: 0 0 40px;
            line-height: 30px;
            width: 40px;
            &.time-l {
              text-align: left;
            }
            &.time-r {
              text-align: right;
            }
          }
          .progress-bar-wrapper {
            flex: 1;
          }
        }
        .operators {
          display: flex;
          align-items: center;
          .icon {
            flex: 1;
            color: $color-theme;
            &.disable {
              color: $color-theme-d;
            }
            i {
              font-size: 30px;
            }
          }
          .i-left {
            text-align: right;
          }
          .i-center {
            padding: 0 20px;
            text-align: center;
            i {
              font-size: 40px;
            }
          }
          .i-right {
            text-align: left;
          }
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
      }
      &.normal-enter-active,
      &.normal-leave-active {
        transition: all 0.6s;
        .top,
        .bottom {
          transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
        }
      }
      &.normal-enter-from,
      &.normal-leave-to {
        opacity: 0;
        .top {
          transform: translate3d(0, -100px, 0);
        }
        .bottom {
          transform: translate3d(0, 100px, 0);
        }
      }
    }
  }
</style>
