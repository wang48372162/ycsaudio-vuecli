<template>
  <div class="page-error">
    <div class="error-content">
      <img class="title-logo" src="@/assets/images/logo.png" alt="ycsAudio Logo">

      <h2 class="error-title">
        {{ message }}
      </h2>

      <router-link to="/" class="btn">
        回首頁
      </router-link>
    </div>
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
  display: flex;
  height: 100vh;
  margin: -1rem;
  text-align: center;
}

.error-content {
  margin: auto;
}

.error-title {
  font-size: 2.25rem;
  margin-bottom: 2rem;
}

.title-logo {
  height: 50px;
  margin-bottom: 1.5rem;
  transform: rotate(5deg);
}

.btn {
  display: inline-block;
  color: #333;
  padding: 0.5rem 1.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  letter-spacing: 1px;
  &:hover {
    background-color: #f9f9f9;
  }
}
</style>
