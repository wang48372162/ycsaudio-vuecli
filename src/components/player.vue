<template>
  <div class="card player">
    <div class="card-body">
      <audio ref="audio">
        HTML5 Audio not supported
      </audio>

      <h1 class="player-title">
        {{ title }}
      </h1>

      <player-controls
        class="player-controls"
        :played="played"
        :error="error"
        :repeat-status="repeatStatus"
        :list-id="listId"
        :prev-id="prevId"
        :next-id="nextId"
        @on-play="clickPlay"
        @on-stop="clickStop"
        @on-update-repeat="updateRepeat"
      ></player-controls>

      <div class="row">
        <player-time
          class="player-time"
          :duration="duration"
          :current-time="currentTime"
        ></player-time>

        <player-volume
          :value="volume"
          :total="volumeTotal"
          :muted="muted"
          @on-change-progress="changeVolume"
          @on-muted="changeMuted"
        ></player-volume>
      </div>

      <progress-bar
        class="player-progressbar"
        :value="currentTime"
        :total="duration"
        @on-change-progress="changeProgress"
      ></progress-bar>
    </div>
  </div>
</template>

<script>
import { getAudioIndex, getList } from '../lib/util'
import PlayerControls from './player-controls.vue'
import PlayerTime from './player-time.vue'
import PlayerVolume from './player-volume.vue'
import ProgressBar from './progress-bar.vue'

export default {
  name: 'Player',
  components: {
    PlayerControls,
    PlayerTime,
    PlayerVolume,
    ProgressBar
  },
  props: {
    id: {
      type: String,
      required: true
    },
    src: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    listId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      audio: null,
      played: false,
      error: false,
      repeatStatus: 0,
      duration: 0,
      currentTime: 0,
      volume: 1,
      volumeTotal: 1,
      muted: false
    }
  },
  watch: {
    src: 'loadAudio'
  },
  computed: {
    audioIndex() {
      return this.id ? getAudioIndex(this.id) : null
    },
    repeatAll() {
      return this.repeatStatus === 1
    },
    repeatOne() {
      return this.repeatStatus === 2
    },
    prevId() {
      let id
      let index = this.audioIndex - 1

      if (!this.listId || index < -1) return

      const audios = getList(this.listId).audios

      // If repeat mode is all,
      // and prev audio is last audio.
      if (
        this.repeatAll &&
        index === -1
      ) {
        id = audios[audios.length - 1]
      } else {
        id = audios[index]
      }

      return id
    },
    nextId() {
      let id
      let index = this.audioIndex + 1

      if (!this.listId) return

      const audios = getList(this.listId).audios
      if (index > audios.length) return

      // If repeat mode is all,
      // and next audio is last audio.
      if (
        this.repeatAll &&
        index === audios.length
      ) {
        id = audios[0]
      } else {
        id = audios[index]
      }

      return id
    }
  },
  methods: {
    loadAudio() {
      this.$emit('on-audio-load-start')

      // Audio Src
      this.audio.src = this.src

      // Autoplay
      this.audio.autoplay = Boolean(this.autoplay)
      this.played = Boolean(this.autoplay)

      this.$emit('on-audio-loaded', this.audio)
    },
    clickPlay() {
      if (this.error) return null

      if (this.audio) {
        if (this.audio.paused) {
          this.audio.play()
        } else {
          this.audio.pause()
        }

        this.played = Boolean(this.audio.paused)
      }
    },
    clickStop() {
      if (this.error) return null

      this.audio.currentTime = 0
      if (!this.audio.paused) {
        this.audio.pause()
      }
      this.played = false
    },
    updateRepeat(status) {
      if (this.error) return null

      this.repeatStatus = status
    },
    repeat() {
      if (this.error) return null

      if (this.listId && this.nextId) {
        this.$router.push({
          query: {
            id: this.nextId,
            list: this.listId
          }
        })
      }

      if (this.repeatOne) {
        this.audio.currentTime = 0
        this.audio.play()
      }
    },
    changeProgress(currentTime) {
      this.currentTime = currentTime
      if (this.audio) {
        this.audio.currentTime = currentTime
      }
    },
    changeVolume(volume) {
      this.volume = volume
      if (this.audio) {
        this.audio.volume = volume
      }
    },
    changeMuted(muted) {
      this.muted = muted
      if (this.audio) {
        this.audio.muted = muted
      }
    }
  },
  mounted() {
    this.audio = this.$refs.audio

    this.loadAudio()

    this.audio.onplay = () => {
      this.played = true
    }
    this.audio.onpause = () => {
      this.played = false
    }
    this.audio.onended = () => {
      this.repeat()
    }
    this.audio.oncanplay = () => {
      this.$emit('on-audio-load-end')
    }
    this.audio.onerror = () => {
      this.$emit('on-audio-load-end')
      this.error = true
      this.repeat()
    }
    this.audio.onloadedmetadata = () => {
      this.duration = this.audio.duration
    }
    this.audio.ontimeupdate = () => {
      this.duration = this.audio.duration
      this.currentTime = this.audio.currentTime
    }
    this.audio.onvolumechange = () => {
      this.volume = this.audio.volume
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';

.player-title {
  font-size: 1.5rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.player-controls {
  margin: 2rem 0;
  text-align: center;
}
.player-time {
  cursor: default;
  user-select: none;
}

.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
</style>
