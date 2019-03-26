<template>
  <div>
    <div class="title">
      <img class="title-logo" src="@/assets/logo.png" alt="ycsAudio Logo">
      {{ pkg.fullname }}
    </div>

    <player
      v-if="audioId"
      :id="audioId"
      :src="audioSrc"
      :title="audioTitle"
      :list-id="listId"
      @on-audio-load-start="audioLoadStart"
      @on-audio-load-end="audioLoadEnd"
    ></player>

    <playlist
      v-if="listId"
      :id="listId"
      :title="listTitle"
      :audios="listAudios"
    ></playlist>

    <div v-if="!audioId && !listId" class="home">
      <img class="home-logo" src="@/assets/logo.png" alt="ycsAudio Logo">

      <div class="description">
        {{ pkg.description }}
      </div>
    </div>
  </div>
</template>

<script>
import pkg from '@/../package.json'
import { getAudio, getList } from '../lib/util'
import Player from '@/components/player.vue'
import Playlist from '@/components/playlist.vue'

export default {
  name: 'Home',
  components: {
    Player,
    Playlist
  },
  data() {
    return {
      audioId: '',
      audioSrc: '',
      audioTitle: '',
      listId: '',
      listTitle: '',
      listAudios: []
    }
  },
  computed: {
    pkg: () => pkg
  },
  watch: {
    $route: {
      handler({ query }) {
        const id = query.id
        const listId = query.list

        if (id) {
          const audio = getAudio(id)
          if (audio) {
            this.audioId = id
            this.audioSrc = audio.url
            this.audioTitle = audio.title
          }
        }
        if (!id || !this.audioId) {
          this.initAudio()
        }

        if (listId) {
          const list = getList(listId)
          if (list) {
            this.listId = list.id
            this.listTitle = list.name
            this.listAudios = list.audios
          }
        }
        if (!listId || !this.listId) {
          this.initLiat()
        }

        this.setTitle()
      },
      immediate: true
    }
  },
  methods: {
    initAudio() {
      this.audioId = ''
      this.audioSrc = ''
      this.audioTitle = ''
    },
    initLiat() {
      this.listId = ''
      this.listTitle = ''
      this.listAudios = ''
    },
    audioLoadStart() {
      this.$nprogress.start()
    },
    audioLoadEnd() {
      this.$nprogress.done()
    },
    setTitle() {
      let subtitle

      if (this.audioTitle) {
        subtitle = this.audioTitle
      } else if (this.listTitle) {
        subtitle = this.listTitle
      }

      document.title = subtitle ? `${subtitle} - ${pkg.fullname}` : pkg.fullname
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  text-align: center;
}
.home-logo {
  width: 200px;
  max-width: 100%;
}
.title-logo {
  height: 40px;
  vertical-align: bottom;
}
.description {
  font-size: 1.5rem;
  margin-top: 0.5rem;
}
</style>
