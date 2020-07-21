<template>
  <player
    v-bind="audio"
    :list-id="list.id"
    @before-load="loadStart"
    @loaded="loadEnd"
  />

  <playlist v-if="list.id" v-bind="list" />
</template>

<script>
import { useRouter } from 'vue-router'
import { useAudio, usePlaylist } from '@/ycsaudio'
import { useLayout } from '@/layouts'
import { nprogress, loadStart, loadEnd } from '@/modules/nprogress'
import { setTitle, scrollToTop } from '@/util'
import Player from '@/components/Player/Player'
import Playlist from '@/components/Playlist'

export default {
  mixins: [useLayout],
  components: {
    Player,
    Playlist
  },
  setup() {
    const router = useRouter()
    const { audio, fetchAudioData } = useAudio()
    const { list, fetchListData } = usePlaylist()

    function visit(route) {
      fetchAudioData(route.params.audio)
      fetchListData(route.query.list)

      if (!audio.id) {
        router.push('/404')
      }

      setTitle(audio || list)
      scrollToTop()
    }

    return {
      audio,
      list,
      visit,
      loadStart,
      loadEnd
    }
  },
  beforeRouteEnter(to, from, next) {
    nprogress.disableLoadedPageDone(to)
    next(vm => {
      if (vm) vm.visit(to)
    })
  },
  beforeRouteUpdate(to, from, next) {
    nprogress.disableLoadedPageDone(to)
    this.visit(to)
    next()
  }
}
</script>
