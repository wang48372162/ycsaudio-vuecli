<template>
  <component :is="layout" class="page-container">
    <router-view @layout="updateLayout" />
  </component>
</template>

<script>
import { setLayout } from '@/layouts'

export default {
  setup() {
    return {
      ...setLayout()
    }
  }
}
</script>
