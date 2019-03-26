<template>
  <div class="page-error">
    <h2 class="error-title">
      {{ message }}
    </h2>

    <router-link to="/">
      回首頁
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Error',
  data() {
    return {
      message: '頁面不存在！'
    }
  }
}
</script>

<style lang="scss" scoped>
.page-error {
  padding: 2rem 0;
  text-align: center;
}
.error-title {
  font-size: 2rem;
}
</style>
