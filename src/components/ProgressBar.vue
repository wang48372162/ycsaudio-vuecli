<template>
  <div class="progress-wrapper" ref="progressRef">
    <div class="progress">
      <div class="bar-play" :style="progressStyle">
        <div class="bar-circle"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { floatFormet } from '@/util'

export default {
  emmits: ['change-progress'],
  props: {
    value: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 100
    },
    isDraggingUpdate: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const progressRef = ref(null)
    const drag = ref(false)
    const dragOffset = ref(0)
    const dragWidth = ref(0)
    const dragBarWidth = ref(0)
    const dragBarX = ref(0)

    const progressWidth = computed(() => {
      let width
      if (!drag.value) {
        width = numberToPercentage(props.value, props.total)
      } else if (!props.error) {
        width = dragWidth.value
      }
      return `${width || 0}%`
    })

    const progressStyle = reactive({
      width: progressWidth
    })

    function getEvent(e) {
      if (e.type.indexOf('touch') !== -1) {
        e = e.touches[0]
      }
      return e
    }

    function numberToPercentage(value, total) {
      return floatFormet(100 / total * value)
    }

    function percentageToNumber(width, total) {
      return floatFormet(Number(String(width).replace('%', '')) / 100 * total)
    }

    function getPerWidth(e) {
      let widthPx = e.clientX - dragOffset.value - dragBarX.value
      if (widthPx < 0) {
        widthPx = 0
      } else if (widthPx > dragBarWidth.value) {
        widthPx = dragBarWidth.value
      }
      return numberToPercentage(widthPx, dragBarWidth.value)
    }

    function matches(e, selector) {
      return e.target.matches(`#${progressRef.value.getAttribute('id')}${selector}`)
    }

    function updateProgress(value) {
      if (value < 0) {
        value = 0
      } else if (value > props.total) {
        value = props.total
      }

      emit('change-progress', value)
    }

    function dragstart(e) {
      e = getEvent(e)

      if (matches(e, ' .bar-circle')) {
        // Click on the circle
        drag.value = true
        dragOffset.value = e.offsetX ? e.offsetX - e.target.clientWidth / 2 : 0
        dragBarWidth.value = progressRef.value.clientWidth
        dragBarX.value = progressRef.value.offsetLeft
        dragWidth.value = getPerWidth(e)
      } else if (
        matches(e, '.progress-wrapper') ||
        matches(e, ' .progress')
      ) {
        // Click on the progress bar
        drag.value = true
        dragOffset.value = 0
        dragBarWidth.value = progressRef.value.clientWidth
        dragBarX.value = progressRef.value.offsetLeft
        dragWidth.value = getPerWidth(e)
      }
    }

    function dragging(e) {
      e = getEvent(e)
      if (drag.value) {
        dragWidth.value = getPerWidth(e)

        if (props.isDraggingUpdate) {
          const value = percentageToNumber(dragWidth.value, props.total)
          updateProgress(value)
        }
      }
    }

    function dragend() {
      if (drag.value && !props.isDraggingUpdate) {
        const value = percentageToNumber(dragWidth.value, props.total)
        updateProgress(value)
      }

      drag.value = false
      dragOffset.value = 0
      dragWidth.value = 0
      dragBarWidth.value = 0
      dragBarX.value = 0
    }

    onMounted(() => {
      window.addEventListener('mousedown', dragstart)
      window.addEventListener('mousemove', dragging)
      window.addEventListener('mouseup', dragend)

      window.addEventListener('touchstart', dragstart)
      window.addEventListener('touchmove', dragging)
      window.addEventListener('touchend', dragend)
    })

    onUnmounted(() => {
      window.removeEventListener('mousedown', dragstart)
      window.removeEventListener('mousemove', dragging)
      window.removeEventListener('mouseup', dragend)

      window.removeEventListener('touchstart', dragstart)
      window.removeEventListener('touchmove', dragging)
      window.removeEventListener('touchend', dragend)
    })

    return {
      // Refs
      progressRef,
      drag,
      dragOffset,
      dragWidth,
      dragBarWidth,
      dragBarX,

      // Computed
      progressWidth,
      progressStyle,

      // Methods
      getEvent,
      numberToPercentage,
      percentageToNumber,
      getPerWidth,
      matches,
      updateProgress,
      dragstart,
      dragging,
      dragend
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';

.progress {
  position: relative;
  height: 4px;
  background: rgba(#e6e6e6, 0.6);

  .bar-play {
    position: absolute;
    height: 100%;
    background: $primary;

    .bar-circle {
      position: absolute;
      top: -6px;
      right: -8px;
      width: 16px;
      height: 16px;
      border-radius: 100%;
      background: $primary;
    }
  }
}

.progress-wrapper {
  cursor: pointer;
  padding: 12px 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
</style>
