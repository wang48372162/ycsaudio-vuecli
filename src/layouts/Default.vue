<template>
  <div>
    <div class="header">
      <router-link to="/" class="header-title">
        <img class="header-logo" src="@/assets/images/logo.png" alt="ycsAudio Logo">
        {{ fullname }}
      </router-link>

      <search />
    </div>

    <slot />
  </div>
</template>

<script>
import pkg from '@/../package.json'
import Search from '@/components/Search'

export default {
  name: 'DefaultLayout',
  components: {
    Search
  },
  setup() {
    const fullname = pkg.fullname

    return {
      fullname
    }
  }
}
</script>
