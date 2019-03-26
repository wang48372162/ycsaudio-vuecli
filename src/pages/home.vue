<template>
  <div>
    <player
      :id="audioId"
      :src="audioSrc"
      :title="audioTitle"
      :autoplay="false"
    ></player>

    <!-- Play list -->
  </div>
</template>

<script>
import audios from '../audios.json'
import Player from '@/components/player.vue'

export default {
  name: 'Home',
  components: {
    Player
  },
  data() {
    return {
      audioId: '',
      audioSrc: '',
      audioTitle: ''
    }
  },
  watch: {
    $route: {
      handler({ query }) {
        const id = query.id

        if (id) {
          const audio = audios.audio.filter(v => v.id === id)[0]
          if (audio) {
            this.audioId = id
            this.audioSrc = audio.url
            this.audioTitle = audio.title
          }
        }
      },
      immediate: true
    }
  }
}
</script>
