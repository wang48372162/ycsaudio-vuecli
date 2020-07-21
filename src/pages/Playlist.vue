<template>
  <playlist v-bind="list" />
</template>

<script>
import { useRouter } from 'vue-router'
import { usePlaylist } from '@/ycsaudio'
import { useLayout } from '@/layouts'
import { setTitle, scrollToTop } from '@/util'
import Playlist from '@/components/Playlist'

export default {
  mixins: [useLayout],
  components: {
    Playlist
  },
  setup() {
    const router = useRouter()
    const { list, fetchListData } = usePlaylist()

    function visit(route) {
      fetchListData(route.params.playlist)

      if (!list.id) {
        router.push('/404')
      }

      setTitle(list)
      scrollToTop()
    }

    return { list, visit }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm) vm.visit(to)
    })
  },
  beforeRouteUpdate(to, from, next) {
    this.visit(to)
    next()
  }
}
</script>
