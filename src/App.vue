<template>
  <div class="app">
    <div class="title">
      {{ title }}
    </div>

    <router-view />
  </div>
</template>

<script>
import pkg from '@/../package.json'

export default {
  data() {
    return {
      title: pkg.fullname
    }
  }
}
</script>

<style lang="scss" scoped>
.app {
  margin: 1rem;
}
</style>
