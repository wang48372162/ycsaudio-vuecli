<template>
  <div>
    <template v-if="listId">
      <router-link
        v-if="prevId"
        :to="audioTo(prevId)"
        :class="classes.btnPrev"
        :title="title.btnPrev"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
          <path class="svg-fill" :d="path.prevBtn" />
        </svg>
      </router-link>
      <div v-else :class="classes.btnPrev" :title="btnText.prev">
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
          <path class="svg-fill" :d="path.prevBtn" />
        </svg>
      </div>
    </template>

    <button :class="btnClass(path.playMode)" @click="play" :title="btnText[path.playMode]">
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
        <path class="svg-fill" :d="path.playBtn" />
      </svg>
    </button>

    <button :class="btnClass('stop')" @click="stop" :title="btnText.stop">
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
        <path class="svg-fill" :d="path.stopBtn" />
      </svg>
    </button>

    <button :class="btnClass('repeat')" @click="repeat" :title="btnText.repeatMode[repeatStatus]">
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
        <path :class="classes.repeatBtn" :d="path.repeatBtn" />
      </svg>
    </button>

    <template v-if="listId">
      <router-link
        v-if="nextId"
        :to="audioTo(nextId)"
        :class="classes.btnNext"
        :title="title.btnNext"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
          <path class="svg-fill" :d="path.nextBtn" />
        </svg>
      </router-link>
      <div v-else :class="classes.btnNext" :title="btnText.next">
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
          <path class="svg-fill" :d="path.nextBtn" />
        </svg>
      </div>
    </template>
  </div>
</template>

<script>
import { reactive, computed, inject, onMounted } from 'vue'
import { getAudio } from '@/ycsaudio'
import { hotkey } from '@/modules/hotkey'

export const REPEAT_NONE = 0
export const REPEAT_ALL = 1
export const REPEAT_SINGLE = 2

export default {
  emits: ['play', 'stop', 'update-repeat'],
  props: {
    played: {
      type: Boolean,
      default: false
    },
    repeatStatus: {
      type: Number,
      default: REPEAT_NONE
    },
    listId: {
      type: String,
      default: ''
    },
    prevId: Number,
    nextId: Number,
    error: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const storage = inject('storage')

    const btnText = {
      play: '播放 (Space)',
      pause: '暫停 (Space)',
      stop: '停止 (S)',
      repeat: '循環 (R)',
      repeatMode: ['無循環', '全部循環', '單曲循環'],
      prev: '上一首',
      next: '下一首'
    }

    const path = reactive({
      playMode: computed(() => {
        return !props.played ? 'play' : 'pause'
      }),

      playBtn: computed(() => {
        return !props.played
          ? 'M 10,8 26,17 26,33 10,41 z M 26,17 41,25 41,25 26,33 z'
          : 'M 10,8 20,8 20,41 10,41 z M 31,8 41,8 41,41 31,41 z'
      }),

      stopBtn: 'M 10,8 41,8 41,41 10,41 z',

      repeatBtn: computed(() => {
        const repeatStatusPath = 'M 48,20 38,30 28,20 35,20 35,14 16,14 16,35 35,35 35,31 41,31 41,41 10,41 10,8 41,8 41,20 z M 25,25 25,25 25,25 25,25 25,25 z'

        const repeatStatusOnePath = 'M 48,20 38,30 28,20 35,20 35,14 16,14 16,35 35,35 35,31 41,31 41,41 10,41 10,8 41,8 41,20 z M 27,16 19,24 23,24 23,33 27,33 z'

        if (props.repeatStatus === REPEAT_NONE ||
          props.repeatStatus === REPEAT_ALL) {
          return repeatStatusPath
        } else if (props.repeatStatus === REPEAT_SINGLE) {
          return repeatStatusOnePath
        }
        return repeatStatusPath
      }),

      prevBtn: 'M 10,8 17,8 17,41 10,41 z M 17,25 41,8 41,41 z',
      nextBtn: 'M 10,8 34,25 10,41 z M 34,8 41,8 41,41 34,41 z'
    })

    const classes = reactive({
      repeatBtn: computed(() => {
        if (props.repeatStatus === REPEAT_NONE) {
          return 'svg-fill-s'
        } else if (props.repeatStatus === REPEAT_ALL) {
          return 'svg-fill'
        } else if (props.repeatStatus === REPEAT_SINGLE) {
          return 'svg-fill'
        }
        return 'svg-fill-s'
      }),
      btnPrev: computed(() => {
        return btnClass('prev', !props.prevId)
      }),
      btnNext: computed(() => {
        return btnClass('next', !props.nextId)
      })
    })

    const title = reactive({
      btnPrev: computed(() => {
        return getAudio(props.prevId).title
      }),
      btnNext: computed(() => {
        return getAudio(props.nextId).title
      })
    })

    function play() {
      emit('play')
    }

    function stop() {
      emit('stop')
    }

    function repeat() {
      if (props.error) return null

      if (props.repeatStatus === REPEAT_NONE) {
        if (!props.listId) {
          updateRepeatStatus(REPEAT_SINGLE)
        } else {
          updateRepeatStatus(REPEAT_ALL)
        }
      } else if (props.repeatStatus === REPEAT_ALL) {
        updateRepeatStatus(REPEAT_SINGLE)
      } else if (props.repeatStatus === REPEAT_SINGLE) {
        updateRepeatStatus(REPEAT_NONE)
      }
    }

    function audioTo(id) {
      return {
        name: 'audio',
        params: { audio: id },
        query: props.listId
          ? { list: props.listId }
          : {}
      }
    }

    function updateRepeatStatus(status) {
      emit('update-repeat', status)
      storage.set('YCSAUDIO_REPEAT_STATUS', status)
    }

    function btnClass(mode, forceDisabled = false) {
      return [
        'button',
        `button-${mode}`,
        forceDisabled || props.error ? 'disabled' : ''
      ]
    }

    onMounted(() => {
      // Repeat status init
      const status = Number(storage.get('YCSAUDIO_REPEAT_STATUS'))
      if (status !== null) {
        if (!props.listId && status === REPEAT_ALL) {
          updateRepeatStatus(REPEAT_SINGLE)
        } else {
          updateRepeatStatus(status)
        }
      }
    })

    hotkey(' ', play)
    hotkey('S', stop)
    hotkey('R', repeat)

    return {
      // Refs
      btnText,
      path,
      classes,
      title,

      // Methods
      play,
      stop,
      repeat,
      audioTo,
      updateRepeatStatus,
      btnClass
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';

$button-size: 50px;

.button {
  width: $button-size;
  height: $button-size;
  padding: 0;

  svg {
    width: $button-size;
    height: $button-size;
  }

  .svg-fill {
    fill: $primary;
    opacity: 0.9;
    transition:
      d $transition-duration,
      fill $transition-duration,
      opacity $transition-duration;
  }
  .svg-fill-s {
    fill: $gray;
    opacity: 0.9;
    transition:
      d $transition-duration,
      fill $transition-duration,
      opacity $transition-duration;
  }
  &:active .svg-fill,
  &:active .svg-fill-s {
    opacity: 1;
  }
  &.disabled,
  &:active.disabled,
  &:hover.disabled {
    cursor: default;

    path {
      fill: $disabled-color !important;
      opacity: 0.8 !important;
    }
  }

  @media only screen and (min-width: 480px) {
    &:hover {
      .svg-fill {
        opacity: 1;
      }
      .svg-fill-s {
        opacity: 1;
      }
    }
  }
}
</style>
