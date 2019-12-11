<template>
  <div class="app">
    <nprogress-container></nprogress-container>

    <router-view />
  </div>
</template>

<script>
import NprogressContainer from 'vue-nprogress/src/NprogressContainer'

export default {
  components: {
    NprogressContainer
  }
}
</script>

<style lang="scss" scoped>
.app {
  padding: 1rem;
}
</style>
