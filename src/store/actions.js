import { PLAY_MODE } from '@/assets/js/constant'

// eslint-disable-next-line no-unused-vars
export function selectPlay({ commit, state }, { list, index }) {
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlaylist', list)
  commit('setCurrentIndex', index)
}
