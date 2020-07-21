<template>
  <div id="player-volume" :title="tooltipText">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      class="volume-muted volume-icon"
      @click="clickMuted"
    >
      <path class="svg-fill" :d="volumeIconPath" />
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
    <progress-bar
      id="player-volume-progress"
      :value="value"
      :total="total"
      :is-dragging-update="true"
      @change-progress="changeVolume"
    ></progress-bar>
  </div>
</template>

<script>
import { computed, inject, onMounted } from 'vue'
import { floatFormet } from '@/util'
import ProgressBar from '@/components/ProgressBar'

export default {
  emits: ['change-progress', 'muted'],
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
  setup(props, { emit }) {
    const storage = inject('storage')
    const text = {
      volume: '音量：',
      muted: '靜音 (M)'
    }

    const volumeIconPath = computed(() => {
      if (props.muted) {
        return 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z'
      } else if (props.value > 0.6) {
        return 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'
      } else if (props.value <= 0.6 && props.value > 0) {
        return 'M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z'
      }
      return 'M7 9v6h4l5 5V4l-5 5H7z'
    })

    const tooltipText = computed(() => {
      if (props.muted) {
        return text.muted
      }
      return `${text.volume}${volumePer(props.value, props.total)}%`
    })

    function initVolume() {
      const storedVolume = storage.get('YCSAUDIO_VOLUME')
      const storedMuted = storage.get('YCSAUDIO_MUTED')

      changeVolume(storedVolume ? Number(storedVolume) : props.value)
      changeMuted(storedMuted ? Boolean(Number(storedMuted)) : props.muted)
    }

    function clickMuted() {
      changeMuted(!props.muted)
    }

    function changeVolume(value) {
      if (value < 0) {
        value = 0
      } else if (value > props.total) {
        value = props.total
      }
      const result = floatFormet(value, 2)
      storage.set('YCSAUDIO_VOLUME', result)
      emit('change-progress', result)
    }

    function changeMuted(value) {
      storage.set('YCSAUDIO_MUTED', value ? 1 : 0)
      emit('muted', value)
    }

    function volumePer(value, total) {
      return Math.floor(value / total * 100)
    }

    onMounted(() => {
      initVolume()
    })

    return {
      // Data
      text,

      // Computed
      volumeIconPath,
      tooltipText,

      // Method
      initVolume,
      clickMuted,
      changeVolume,
      changeMuted,
      volumePer
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';

#player-volume {
  display: flex;
  flex-direction: row;
  align-items: center;

  .svg-fill {
    fill: $primary;
    opacity: 0.9;
    transition: opacity $transition-duration;
  }

  @media only screen and (min-width: 480px) {
    &:hover {
      .svg-fill {
        opacity: 1;
      }
    }
  }
}
#player-volume-progress {
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
