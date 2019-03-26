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
        ref="controls"
        :played="played"
        :error="error"
        :repeat-status="repeatStatus"
        :use-list="useList"
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
    useList: {
      type: Boolean,
      default: false
    },
    prevId: String,
    nextId: String
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
  methods: {
    loadAudio() {
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

      if (this.repeatStatus === 1) {
        // List repeat all
      } else if (this.repeatStatus === 2) {
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
    this.audio.onerror = () => {
      this.error = true
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

@media only screen and (min-width: 480px) {
  .button:hover {
    .svg-fill {
      opacity: 1;
    }
    .svg-fill-s {
      opacity: 1;
    }
  }
}
</style>
