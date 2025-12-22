<template>
  <div class="login-bg">
    <div class="login-container">
      <n-card title="系统登录" bordered hoverable size="large" style="width: 400px">
        <n-form ref="formRef" :model="model" :rules="rules">
          <n-form-item path="username" label="用户名/邮箱">
            <n-input v-model:value="model.username" placeholder="请输入用户名或邮箱" />
          </n-form-item>
          <n-form-item path="password" label="密码">
            <n-input
              v-model:value="model.password"
              type="password"
              show-password-on="click"
              placeholder="请输入密码"
            />
          </n-form-item>
          <n-row :gutter="[0, 24]">
            <n-col :span="24">
              <div style="display: flex; justify-content: flex-end">
                <n-button
                  type="primary"
                  @click="handleLogin"
                  :loading="loading"
                  block
                  style="width: 100%"
                >
                  登录
                </n-button>
              </div>
            </n-col>
          </n-row>
          <n-row :gutter="[0, 12]">
            <n-col :span="24">
              <div style="display: flex; justify-content: center; margin-top: 16px">
                <span style="color: #666">还没有账号？</span>
                <router-link to="/register" style="margin-left: 8px; color: #18a058; text-decoration: none">
                  立即注册
                </router-link>
              </div>
            </n-col>
          </n-row>
        </n-form>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, reactive } from 'vue'
import { useMessage } from 'naive-ui'
import { useUserStore } from '../store/modules/user'

const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

const formRef = ref(null)
const loading = ref(false)

const model = reactive({
  username: '317262095@qq.com',
  password: '123456'
})

const rules = {
  username: {
    required: true,
    message: '请输入用户名或邮箱',
    trigger: ['input', 'blur']
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: ['input', 'blur']
  }
}

const handleLogin = (e) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      loading.value = true
      try {
        await userStore.login(model)
        message.success('登录成功')
        router.push('/')
      } catch (error) {
        // message.error('登录失败')
      } finally {
        loading.value = false
      }
    } else {
      message.error('请填写完整信息')
    }
  })
}
</script>

<style scoped>
.login-bg {
  width: 100%;
  height: 100vh;
  background-color: #f0f2f5;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
