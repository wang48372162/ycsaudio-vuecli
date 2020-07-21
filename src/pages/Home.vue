<template>
  <div class="home">
    <img class="home-logo" src="@/assets/images/logo.png" alt="ycsAudio Logo">

    <div class="description">
      {{ description }}
    </div>
  </div>
</template>

<script>
import pkg from '@/../package.json'
import { useLayout } from '@/layouts'
import { setTitle } from '@/util'

export default {
  mixins: [useLayout],
  setup() {
    const description = pkg.description

    setTitle()

    return { description }
  }
}
</script>

<style lang="scss" scoped>
.home {
  padding: 2rem 0;
  text-align: center;
}
.home-logo {
  width: 200px;
  max-width: 100%;
}
.description {
  font-size: 1.5rem;
  margin-top: 0.5rem;
}
</style>
