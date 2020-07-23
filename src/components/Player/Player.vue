<template>
  <div class="card player">
    <div class="card-body">
      <audio ref="audioRef">HTML5 Audio not supported</audio>

      <h1 class="player-title">{{ title }}</h1>

      <player-controls
        class="player-controls"
        :played="played"
        :repeat-status="repeat.status"
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
          :volume="volume"
          :total="volumeTotal"
          :muted="muted"
          @change-progress="changeVolume"
          @muted="changeMuted"
        />
      </div>

      <player-progress-bar
        :current-time="currentTime"
        :duration="duration"
        :error="error"
        @change-progress="changeProgress"
      />
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getList, getAudioIndexFromList } from '@/ycsaudio'
import PlayerControls, { REPEAT_NONE, REPEAT_ALL, REPEAT_SINGLE } from '@/components/Player/PlayerControls'
import PlayerTime from '@/components/Player/PlayerTime'
import PlayerVolume from '@/components/Player/PlayerVolume'
import PlayerProgressBar from '@/components/Player/PlayerProgressBar'

export default {
  components: {
    PlayerControls,
    PlayerTime,
    PlayerVolume,
    PlayerProgressBar
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
    const volumeRef = ref(null)
    const played = ref(false)
    const error = ref(false)
    const duration = ref(0)
    const currentTime = ref(0)
    const volume = ref(1)
    const volumeTotal = ref(1)
    const muted = ref(false)

    const audioIndex = computed(() => props.id ? getAudioIndexFromList(props.listId, props.id) : null)

    const listAudios = computed(() => {
      const list = getList(props.listId)
      return list ? list.audios : null
    })

    const repeat = reactive({
      status: REPEAT_NONE,
      isAll: computed(() => repeat.status === REPEAT_ALL),
      isSingle: computed(() => repeat.status === REPEAT_SINGLE)
    })

    const prevId = computed(() => {
      const index = audioIndex.value - 1

      if (!props.listId || index < -1) return

      // If repeat mode is all,
      // and prev audio is last audio.
      if (repeat.isAll && index === -1) {
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
        repeat.isAll &&
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

      repeat.status = status
    }

    async function repeatAudio() {
      if (props.listId && nextId.value && !repeat.isSingle) {
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

      if (repeat.isSingle && !error.value) {
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

    onMounted(() => {
      // Audio init
      audioRef.value.preload = 'auto'

      // Set autoplay
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
        repeatAudio()
      }
      audioRef.value.onerror = function () {
        error.value = true
        emit('error')
        emit('loaded')
        repeatAudio()
      }
      audioRef.value.ontimeupdate = function () {
        duration.value = this.duration
        currentTime.value = this.currentTime
      }
      audioRef.value.onvolumechange = function () {
        volume.value = this.volume
      }

      // Play audio
      if (props.autoplay) {
        audioRef.value.play().then(() => {
          //
        }).catch(e => {
          played.value = false
        })
      }
    })

    watch(() => props.src, loadAudio)

    return {
      // Refs
      audioRef,
      volumeRef,
      played,
      error,
      repeat,
      duration,
      currentTime,
      volume,
      volumeTotal,
      muted,

      // Computed
      audioIndex,
      listAudios,
      prevId,
      nextId,

      // Methods
      loadAudio,
      clickPlay,
      clickStop,
      clickRepeat,
      repeatAudio,
      changeProgress,
      changeVolume,
      changeMuted
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
