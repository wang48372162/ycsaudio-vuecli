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
        ref="controls"
        class="player-controls"
        :played="played"
        :repeat-status="repeatStatus"
        :list-id="listId"
        :prev-id="prevId"
        :next-id="nextId"
        :error="error"
        @on-play="clickPlay"
        @on-stop="clickStop"
        @on-update-repeat="clickRepeat"
      ></player-controls>

      <div class="row">
        <player-time
          class="player-time"
          :duration="duration"
          :current-time="currentTime"
        ></player-time>

        <player-volume
          ref="volume"
          :value="volume"
          :total="volumeTotal"
          :muted="muted"
          @on-change-progress="changeVolume"
          @on-muted="changeMuted"
        ></player-volume>
      </div>

      <progress-bar
        ref="progressbar"
        id="player-progressbar"
        :value="currentTime"
        :total="duration"
        :error="error"
        @on-change-progress="changeProgress"
      ></progress-bar>
    </div>
  </div>
</template>

<script>
import { getList, getListAudioIndex } from '../lib/util'
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
      return this.id
        ? getListAudioIndex(this.listId, this.id)
        : null
    },
    listAudios() {
      const list = getList(this.listId)
      return list ? list.audios : null
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

      // If repeat mode is all,
      // and prev audio is last audio.
      if (
        this.repeatAll &&
        index === -1
      ) {
        id = this.listAudios[this.listAudios.length - 1]
      } else {
        id = this.listAudios[index]
      }

      return id
    },
    nextId() {
      let id
      let index = this.audioIndex + 1

      if (!this.listId) return

      if (index > this.listAudios.length) return

      // If repeat mode is all,
      // and next audio is last audio.
      if (
        this.repeatAll &&
        index === this.listAudios.length
      ) {
        id = this.listAudios[0]
      } else {
        id = this.listAudios[index]
      }

      return id
    }
  },
  methods: {
    loadAudio() {
      this.$emit('on-audio-load-start')

      // Audio Src
      this.audio.src = this.src
      this.error = false

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
    clickRepeat(status) {
      if (this.error) return null

      this.repeatStatus = status
    },
    async repeat() {
      if (this.listId && this.nextId && !this.repeatOne) {
        if (this.error) {
          await new Promise(resolve => {
            setTimeout(resolve, 3e3)
          })
        }

        this.$router.push({
          query: {
            id: this.nextId,
            list: this.listId
          }
        })
      }

      if (this.repeatOne && !this.error) {
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
    // Audio init
    this.audio = this.$refs.audio
    this.audio.preload = 'auto'

    // Autoplay
    this.audio.autoplay = Boolean(this.autoplay)
    this.played = Boolean(this.autoplay)

    this.loadAudio()

    // Audio events
    this.audio.onloadedmetadata = () => {
      this.duration = this.audio.duration
    }
    this.audio.oncanplay = () => {
      this.$emit('on-audio-load-end')

      this.$refs.volume.initVolume()
    }
    this.audio.onplay = () => {
      this.played = true
    }
    this.audio.onpause = () => {
      this.played = false
    }
    this.audio.onended = () => {
      this.repeat()
    }
    this.audio.onerror = () => {
      this.error = true
      this.$emit('on-error')
      this.$emit('on-audio-load-end')
      this.repeat()
    }
    this.audio.ontimeupdate = () => {
      this.duration = this.audio.duration
      this.currentTime = this.audio.currentTime
    }
    this.audio.onvolumechange = () => {
      this.volume = this.audio.volume
    }

    const vm = this

    // Keyboard
    window.addEventListener('keydown', e => {
      const keys = [
        { // Play/Pause (Space)
          code: 32,
          run: () => {
            vm.clickPlay()
          }
        },
        { // Stop (S)
          code: 83,
          run: () => {
            vm.clickStop()
          }
        },
        { // Repeat (R)
          code: 82,
          run: () => {
            vm.$refs.controls.repeat()
          }
        },
        { // Backward Audio (ArrowLeft)
          code: 37,
          run: () => {
            vm.$refs.progressbar.updateProgress(vm.currentTime - 5)
          }
        },
        { // Forward Audio (ArrowRight)
          code: 39,
          run: () => {
            vm.$refs.progressbar.updateProgress(vm.currentTime + 5)
          }
        },
        { // Volume Up (ArrowUp)
          code: 38,
          run: () => {
            vm.$refs.volume.changeVolume(vm.volume + 0.05)
          }
        },
        { // Volume Down (ArrowDown)
          code: 40,
          run: () => {
            vm.$refs.volume.changeVolume(vm.volume - 0.05)
          }
        },
        { // Muted (M)
          code: 77,
          run: () => {
            vm.$refs.volume.clickMuted()
          }
        }
      ]

      keys.forEach(keyData => {
        if (e.keyCode === keyData.code && keyData.run) {
          e.preventDefault()
          keyData.run()
        }
      })
    })
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
