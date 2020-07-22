<template>
  <div>
    <span>{{ currentTimeText }}</span> / <span>{{ durationText }}</span>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
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
  methods: {
  },
  setup(props) {
    const durationText = computed(() => {
      return timeFormet(props.duration)
    })

    const currentTimeText = computed(() => {
      return timeFormet(props.currentTime)
    })

    function timeFormet(duration) {
      duration = !isNaN(duration) ? duration : 0
      const s = timeNumFormet(parseInt(duration % 60))
      const m = timeNumFormet(parseInt((duration / 60) % 60))
      return `${m}:${s}`
    }

    function timeNumFormet(number) {
      const currentNum = String(number).length
      for (let i = currentNum; i < 2; i++) {
        number = `0${number}`
      }
      return number
    }

    return {
      // Computed
      durationText,
      currentTimeText,

      // Methods
      timeFormet,
      timeNumFormet
    }
  }
}
</script>
