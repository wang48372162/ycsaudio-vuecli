<template>
  <div>
    <span>{{ currentTimeText }}</span> / <span>{{ durationText }}</span>
  </div>
</template>

<script>
export default {
  name: 'PlayerTime',
  props: {
    duration: {
      type: Number,
      default: 0
    },
    currentTime: {
      type: Number,
      default: 0
    }
  },
  computed: {
    durationText() {
      return this.timeFormet(this.duration)
    },
    currentTimeText() {
      return this.timeFormet(this.currentTime)
    }
  },
  methods: {
    timeFormet(duration) {
      duration = !isNaN(duration) ? duration : 0
      const s = this.timeNumFormet(parseInt(duration % 60))
      const m = this.timeNumFormet(parseInt((duration / 60) % 60))
      return `${m}:${s}`
    },
    timeNumFormet(number) {
      const currentNum = String(number).length
      for (let i = currentNum; i < 2; i++) {
        number = `0${number}`
      }
      return number
    }
  }
}
</script>
