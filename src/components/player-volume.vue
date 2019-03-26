<template>
  <div class="player-volume">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      class="volume-icon"
      @click="clickIcon"
    >
      <path :d="volumeIconPath" />
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
    <progress-bar
      class="player-volume-progress"
      :value="value"
      :total="total"
      :is-dragging-update="true"
      @on-change-progress="changeVolume"
    ></progress-bar>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import ProgressBar from './progress-bar.vue'

export default {
  name: 'PlayerVolume',
  components: {
    ProgressBar
  },
  props: {
    value: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 1
    },
    muted: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    volumeIconPath() {
      let path
      if (this.muted) {
        path = 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z'
      } else if (this.value > 0.6) {
        path = 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'
      } else if (this.value <= 0.6 && this.value > 0) {
        path = 'M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z'
      } else {
        path = 'M7 9v6h4l5 5V4l-5 5H7z'
      }
      return path
    }
  },
  methods: {
    clickIcon() {
      this.changeMuted(!this.muted)
    },
    changeVolume(value) {
      this.$emit('on-change-progress', value)
      Cookies.set('YCSAUDIO_VOLUME', value)
    },
    changeMuted(value) {
      this.$emit('on-muted', value)
      Cookies.set('YCSAUDIO_MUTED', value ? 1 : 0)
    }
  },
  created() {
    // Volume init
    const VOLUME = Number(Cookies.get('YCSAUDIO_VOLUME'))
    if (VOLUME) {
      this.changeVolume(VOLUME)
    }
    const MUTED = Number(Cookies.get('YCSAUDIO_MUTED'))
    if (MUTED) {
      this.changeMuted(MUTED)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';

.player-volume {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.player-volume-progress {
  width: 50px;
  max-width: 50px;
}
.volume-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
</style>
