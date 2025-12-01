<template>
  <div class="app-container">
    <h1>404 Not Found</h1>
    <n-button @click="$router.push('/')">返回首页</n-button>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
