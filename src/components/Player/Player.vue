<template>
  <div class="card player">
    <div class="card-body">
      <audio ref="audioRef">HTML5 Audio not supported</audio>

      <h1 class="player-title">{{ title }}</h1>

      <player-controls
        ref="controlsRef"
        class="player-controls"
        :played="played"
        :repeat-status="repeatStatus"
        :list-id="listId"
        :prev-id="prevId"
        :next-id="nextId"
        :error="error"
        @play="clickPlay"
        @stop="clickStop"
        @update-repeat="clickRepeat"
      />

      <div class="row">
        <player-time
          class="player-time"
          :duration="duration"
          :current-time="currentTime"
        />

        <player-volume
          ref="volumeRef"
          :value="volume"
          :total="volumeTotal"
          :muted="muted"
          @change-progress="changeVolume"
          @muted="changeMuted"
        />
      </div>

      <progress-bar
        ref="progressbarRef"
        id="player-progressbar"
        :value="currentTime"
        :total="duration"
        :error="error"
        @change-progress="changeProgress"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getList, getAudioIndexFromList } from '@/ycsaudio'
import PlayerControls from '@/components/Player/PlayerControls'
import PlayerTime from '@/components/Player/PlayerTime'
import PlayerVolume from '@/components/Player/PlayerVolume'
import ProgressBar from '@/components/ProgressBar'

export default {
  components: {
    PlayerControls,
    PlayerTime,
    PlayerVolume,
    ProgressBar
  },
  emits: ['before-load', 'loaded-dom', 'loaded', 'error'],
  props: {
    id: {
      type: Number,
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
  setup(props, { emit }) {
    const router = useRouter()
    const audioRef = ref(null)
    const controlsRef = ref(null)
    const progressbarRef = ref(null)
    const volumeRef = ref(null)
    const played = ref(false)
    const error = ref(false)
    const repeatStatus = ref(0)
    const duration = ref(0)
    const currentTime = ref(0)
    const volume = ref(1)
    const volumeTotal = ref(1)
    const muted = ref(false)

    const audioIndex = computed(() => {
      return props.id
        ? getAudioIndexFromList(props.listId, props.id)
        : null
    })

    const listAudios = computed(() => {
      const list = getList(props.listId)
      return list ? list.audios : null
    })

    const repeatAll = computed(() => {
      return repeatStatus.value === 1
    })

    const repeatOne = computed(() => {
      return repeatStatus.value === 2
    })

    const prevId = computed(() => {
      const index = audioIndex.value - 1

      if (!props.listId || index < -1) return

      // If repeat mode is all,
      // and prev audio is last audio.
      if (repeatAll.value && index === -1) {
        return listAudios.value[listAudios.value.length - 1]
      }
      return listAudios.value[index]
    })

    const nextId = computed(() => {
      const index = audioIndex.value + 1

      if (!props.listId) return
      if (index > listAudios.value.length) return

      // If repeat mode is all,
      // and next audio is last audio.
      if (
        repeatAll.value &&
        index === listAudios.value.length
      ) {
        return listAudios.value[0]
      }
      return listAudios.value[index]
    })

    function loadAudio() {
      emit('before-load')

      // Audio Src
      audioRef.value.src = props.src
      error.value = false

      emit('loaded-dom', audioRef.value)
    }

    function clickPlay() {
      if (error.value) return null

      if (audioRef.value) {
        if (audioRef.value.paused) {
          audioRef.value.play()
        } else {
          audioRef.value.pause()
        }

        played.value = Boolean(audioRef.value.paused)
      }
    }

    function clickStop() {
      if (error.value) return null

      audioRef.value.currentTime = 0
      if (!audioRef.value.paused) {
        audioRef.value.pause()
      }
      played.value = false
    }

    function clickRepeat(status) {
      if (error.value) return null

      repeatStatus.value = status
    }

    async function repeat() {
      if (props.listId && nextId.value && !repeatOne.value) {
        if (error.value) {
          await new Promise(resolve => {
            setTimeout(resolve, 3e3)
          })
        }

        const query = props.listId
          ? { list: props.listId }
          : {}

        router.push({
          name: 'audio',
          params: { audio: nextId.value },
          query
        })
      }

      if (repeatOne.value && !error.value) {
        audioRef.value.currentTime = 0
        audioRef.value.play()
      }
    }

    function changeProgress(newCurrentTime) {
      currentTime.value = newCurrentTime
      if (audioRef.value) {
        audioRef.value.currentTime = newCurrentTime
      }
    }

    function changeVolume(newVolume) {
      volume.value = newVolume
      if (audioRef.value) {
        audioRef.value.volume = newVolume
      }
    }

    function changeMuted(newMuted) {
      muted.value = newMuted
      if (audioRef.value) {
        audioRef.value.muted = newMuted
      }
    }

    function keyEvent(e) {
      const keys = [
        { // Play/Pause (Space)
          code: 32,
          run() {
            clickPlay()
          }
        },
        { // Stop (S)
          code: 83,
          run() {
            clickStop()
          }
        },
        { // Repeat (R)
          code: 82,
          run() {
            controlsRef.value.repeat()
          }
        },
        { // Backward Audio (ArrowLeft)
          code: 37,
          run() {
            progressbarRef.value.updateProgress(currentTime.value - 5)
          }
        },
        { // Forward Audio (ArrowRight)
          code: 39,
          run() {
            progressbarRef.value.updateProgress(currentTime.value + 5)
          }
        },
        { // Volume Up (ArrowUp)
          code: 38,
          run() {
            volumeRef.value.changeVolume(volume.value + 0.05)
          }
        },
        { // Volume Down (ArrowDown)
          code: 40,
          run() {
            volumeRef.value.changeVolume(volume.value - 0.05)
          }
        },
        { // Muted (M)
          code: 77,
          run() {
            volumeRef.value.clickMuted()
          }
        }
      ]

      keys.forEach(keyData => {
        const hasKeyCode = e.keyCode === keyData.code
        const isNotSearchInput = !e.target.matches('input.search-input')
        if (hasKeyCode && keyData.run && isNotSearchInput) {
          e.preventDefault()
          keyData.run()
        }
      })
    }

    onMounted(() => {
      // Audio init
      audioRef.value.preload = 'auto'

      // Autoplay
      audioRef.value.autoplay = props.autoplay
      played.value = props.autoplay

      loadAudio()

      // Audio events
      audioRef.value.onloadedmetadata = function () {
        duration.value = this.duration
      }
      audioRef.value.oncanplay = function () {
        emit('loaded')

        volumeRef.value.initVolume()
      }
      audioRef.value.onplay = function () {
        played.value = true
      }
      audioRef.value.onpause = function () {
        played.value = false
      }
      audioRef.value.onended = function () {
        repeat()
      }
      audioRef.value.onerror = function () {
        error.value = true
        emit('error')
        emit('loaded')
        repeat()
      }
      audioRef.value.ontimeupdate = function () {
        duration.value = this.duration
        currentTime.value = this.currentTime
      }
      audioRef.value.onvolumechange = function () {
        volume.value = this.volume
      }

      // Keyboard event
      window.addEventListener('keydown', keyEvent)
    })

    onUnmounted(() => {
      window.removeEventListener('keydown', keyEvent)
    })

    watch(() => props.src, loadAudio)

    return {
      // Data
      audioRef,
      controlsRef,
      progressbarRef,
      volumeRef,
      played,
      error,
      repeatStatus,
      duration,
      currentTime,
      volume,
      volumeTotal,
      muted,

      // Computed
      audioIndex,
      listAudios,
      repeatAll,
      repeatOne,
      prevId,
      nextId,

      // Method
      loadAudio,
      clickPlay,
      clickStop,
      clickRepeat,
      repeat,
      changeProgress,
      changeVolume,
      changeMuted,
      keyEvent
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';

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
