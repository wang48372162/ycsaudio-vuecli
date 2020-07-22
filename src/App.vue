<template>
  <component :is="layout" class="page-container">
    <router-view @layout="updateLayout" />
  </component>
</template>

<script>
import { onMounted, onUnmounted } from 'vue'
import { setLayout } from '@/layouts'
import { registerHotkeyEvent, unregisterHotkeyEvent } from '@/modules/hotkey'

export default {
  setup() {
    onMounted(() => {
      registerHotkeyEvent()
    })

    onUnmounted(() => {
      unregisterHotkeyEvent()
    })

    return {
      ...setLayout()
    }
  }
}
</script>
