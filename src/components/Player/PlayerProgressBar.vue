<template>
  <progress-bar
    id="player-progressbar"
    ref="progressRef"
    :value="currentTime"
    :total="duration"
    :error="error"
    @change-progress="changeProgress"
  />
</template>

<script>
import { ref } from 'vue'
import { hotkey } from '@/modules/hotkey'
import ProgressBar from '@/components/ProgressBar'

export default {
  components: {
    ProgressBar
  },
  emmits: ['change-progress'],
  props: {
    currentTime: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 100
    },
    error: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const progressRef = ref(null)

    function forward() {
      progressRef.value.updateProgress(props.currentTime + 5)
    }

    function backward() {
      progressRef.value.updateProgress(props.currentTime - 5)
    }

    function changeProgress(value) {
      emit('change-progress', value)
    }

    hotkey('ArrowLeft', backward)
    hotkey('ArrowRight', forward)

    return {
      // Refs
      progressRef,

      // Methods
      forward,
      backward,
      changeProgress
    }
  }
}
</script>
