<template>
  <div id="app" class="page-container">
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
