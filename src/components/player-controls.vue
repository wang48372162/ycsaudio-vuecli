<template>
  <div>
    <a href="javascript: void(0)" :class="btnPrevCls" :title="btnText.prev" v-if="useList">
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
        <path class="svg-fill" :d="prevBtnPath" />
      </svg>
    </a>

    <button :class="btnCls(playMode)" @click="play" :title="btnText[playMode]">
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
        <path class="svg-fill" :d="playBtnPath" />
      </svg>
    </button>

    <button :class="btnCls('stop')" @click="stop" :title="btnText.stop">
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
        <path class="svg-fill" :d="stopBtnPath" />
      </svg>
    </button>

    <button :class="btnCls('repeat')" @click="repeat" :title="btnText.repeat">
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
        <path :class="repeatBtnPathCls" :d="repeatBtnPath" />
      </svg>
    </button>

    <a href="javascript: void(0)" :class="btnNextCls" :title="btnText.next" v-if="useList">
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
        <path class="svg-fill" :d="nextBtnPath" />
      </svg>
    </a>
  </div>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  name: 'PlayerControls',
  props: {
    played: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    repeatStatus: {
      type: Number,
      default: 0
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
      btnText: {
        play: '播放',
        pause: '暫停',
        stop: '停止',
        repeat: '循環',
        repeatMode: ['正常', '全部循環', '單曲循環'],
        prev: '上一首',
        next: '下一首'
      }
    }
  },
  computed: {
    playMode() {
      return !this.played ? 'play' : 'pause'
    },
    playBtnPath() {
      return !this.played
        ? 'M 10,8 26,17 26,33 10,41 z M 26,17 41,25 41,25 26,33 z'
        : 'M 10,8 20,8 20,41 10,41 z M 31,8 41,8 41,41 31,41 z'
    },
    stopBtnPath() {
      return 'M 10,8 41,8 41,41 10,41 z'
    },
    repeatBtnPath() {
      let result
      const repeatStatusPath = 'M 48,20 38,30 28,20 35,20 35,14 16,14 16,35 35,35 35,31 41,31 41,41 10,41 10,8 41,8 41,20 z M 25,25 25,25 25,25 25,25 25,25 z'
      const repeatStatusOnePath = 'M 48,20 38,30 28,20 35,20 35,14 16,14 16,35 35,35 35,31 41,31 41,41 10,41 10,8 41,8 41,20 z M 27,16 19,24 23,24 23,33 27,33 z'

      if (this.repeatStatus === 0 || this.repeatStatus === 1) {
        result = repeatStatusPath
      } else if (this.repeatStatus === 2) {
        result = repeatStatusOnePath
      } else {
        result = repeatStatusOnePath
      }

      return result
    },
    repeatBtnPathCls() {
      let result

      if (this.repeatStatus === 0) {
        result = 'svg-fill-s'
      } else if (this.repeatStatus === 1) {
        result = 'svg-fill'
      } else if (this.repeatStatus === 2) {
        result = 'svg-fill'
      }

      return result
    },
    prevBtnPath() {
      return 'M 10,8 17,8 17,41 10,41 z M 17,25 41,8 41,41 z'
    },
    nextBtnPath() {
      return 'M 10,8 34,25 10,41 z M 34,8 41,8 41,41 34,41 z'
    },
    btnPrevCls() {
      return this.btnCls('prev', !this.prevId)
    },
    btnNextCls() {
      return this.btnCls('next', !this.nextId)
    }
  },
  methods: {
    play() {
      this.$emit('on-play')
    },
    stop() {
      this.$emit('on-stop')
    },
    repeat() {
      if (this.error) return null

      if (this.repeatStatus === 0) {
        if (!this.useList) {
          this.setRepeatStatus(2)
        } else {
          this.setRepeatStatus(1)
        }
      } else if (this.repeatStatus === 1) {
        this.setRepeatStatus(2)
      } else if (this.repeatStatus === 2) {
        this.setRepeatStatus(0)
      } else {
        this.setRepeatStatus(0)
      }

      this.$emit('on-repeat', this.repeatStatus)
    },
    setRepeatStatus(status) {
      this.$emit('on-update-repeat', status)
      Cookies.set('YCSAUDIO_REPEAT_STATUS', status)
    },
    btnCls(mode, forceDisabled = false) {
      return [
        'button',
        `button-${mode}`,
        forceDisabled || this.error ? 'disabled' : ''
      ]
    }
  },
  created() {
    // Repeat status init
    const REPEAT_STATUS = Number(Cookies.get('YCSAUDIO_REPEAT_STATUS'))
    if (REPEAT_STATUS) {
      this.setRepeatStatus(REPEAT_STATUS)
    }
    if (!this.useList && this.repeatStatus === 1) {
      this.setRepeatStatus(2)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';

$button-size: 50px;

.button {
  display: inline-block !important;
  width: $button-size;
  height: $button-size;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  svg {
    width: $button-size;
    height: $button-size;
  }

  .svg-fill {
    fill: $black;
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
}
</style>
