<template>
  <div class="progress-wrapper" ref="progressbar" @click="click">
    <div class="progress">
      <div class="bar-play" :style="progressStyle">
        <div class="bar-circle"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { floatFormet } from '../lib/util'

export default {
  name: 'ProbressBar',
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
    }
  },
  data() {
    return {
      bar: null,
      drag: false,
      dragOffset: 0,
      dragWidth: 0,
      dragBarWidth: 0,
      dragBarX: 0
    }
  },
  computed: {
    progressStyle() {
      return {
        width: this.progressWidth
      }
    },
    progressWidth() {
      let width
      if (!this.drag) {
        width = this.numberToPercentage(this.value, this.total)
      } else {
        width = this.dragWidth
      }
      return `${width || 0}%`
    }
  },
  methods: {
    updateProgress(value) {
      if (value < 0) {
        value = 0
      } else if (value > this.total) {
        value = this.total
      }

      this.$emit('on-change-progress', value)
    },
    click(e) {
      this.drag = true
      this.dragOffset = 0
      this.dragBarWidth = this.bar.clientWidth
      this.dragBarX = this.bar.offsetLeft
      this.dragWidth = this.getWidth(e)

      const value = this.percentageToNumber(this.dragWidth, this.total)
      this.updateProgress(value)

      this.drag = false
    },
    dragstart(e) {
      e = this.getEvent(e)
      if (e.target.matches(`#${this.bar.getAttribute('id')} .bar-circle`)) {
        this.drag = true
        this.dragBarWidth = this.bar.clientWidth
        this.dragBarX = this.bar.offsetLeft
        this.dragOffset = e.offsetX ? e.offsetX - e.target.clientWidth / 2 : 0
        this.dragWidth = this.getWidth(e)
      }
    },
    dragging(e) {
      e = this.getEvent(e)
      if (this.drag) {
        this.dragWidth = this.getWidth(e)

        if (this.isDraggingUpdate) {
          const value = this.percentageToNumber(this.dragWidth, this.total)
          this.updateProgress(value)
        }
      }
    },
    dragend() {
      if (this.drag && !this.isDraggingUpdate) {
        const value = this.percentageToNumber(this.dragWidth, this.total)
        this.updateProgress(value)
      }

      this.drag = false
      this.dragOffset = 0
      this.dragWidth = 0
      this.dragBarWidth = 0
      this.dragBarX = 0
    },
    numberToPercentage(value, total) {
      return floatFormet(100 / total * value)
    },
    percentageToNumber(width, total) {
      width = Number(String(width).replace('%', ''))
      return floatFormet(width / 100 * total)
    },
    getEvent(e) {
      if (e.type.indexOf('touch') !== -1) {
        e = e.touches[0]
      }
      return e
    },
    getWidth(e) {
      let widthPx = e.clientX - this.dragOffset - this.dragBarX
      if (widthPx < 0) {
        widthPx = 0
      } else if (widthPx > this.dragBarWidth) {
        widthPx = this.dragBarWidth
      }
      return this.numberToPercentage(widthPx, this.dragBarWidth)
    }
  },
  created() {
    window.addEventListener('mousedown', this.dragstart)
    window.addEventListener('mousemove', this.dragging)
    window.addEventListener('mouseup', this.dragend)

    window.addEventListener('touchstart', this.dragstart)
    window.addEventListener('touchmove', this.dragging)
    window.addEventListener('touchend', this.dragend)
  },
  mounted() {
    this.bar = this.$refs.progressbar
  },
  destroyed() {
    window.removeEventListener('mousedown', this.dragstart)
    window.removeEventListener('mousemove', this.dragging)
    window.removeEventListener('mouseup', this.dragend)

    window.removeEventListener('touchstart', this.dragstart)
    window.removeEventListener('touchmove', this.dragging)
    window.removeEventListener('touchend', this.dragend)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';

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
