<template>
  <div class="register-bg">
    <div class="register-container">
      <n-card title="用户注册" bordered hoverable size="large" style="width: 450px">
        <n-form ref="formRef" :model="model" :rules="rules">
          <n-form-item path="email" label="邮箱">
            <n-input
              v-model:value="model.email"
              placeholder="请输入邮箱"
              @keydown.enter.prevent="handleRegister"
            />
          </n-form-item>

          <n-form-item path="username" label="用户名">
            <n-input
              v-model:value="model.username"
              placeholder="请输入用户名（可选）"
              @keydown.enter.prevent="handleRegister"
            />
          </n-form-item>

          <n-form-item path="realName" label="真实姓名">
            <n-input
              v-model:value="model.realName"
              placeholder="请输入真实姓名（可选）"
              @keydown.enter.prevent="handleRegister"
            />
          </n-form-item>

          <n-form-item path="password" label="密码">
            <n-input
              v-model:value="model.password"
              type="password"
              show-password-on="click"
              placeholder="请输入密码（至少6位）"
              @keydown.enter.prevent="handleRegister"
            />
          </n-form-item>

          <n-form-item path="confirmPassword" label="确认密码">
            <n-input
              v-model:value="model.confirmPassword"
              type="password"
              show-password-on="click"
              placeholder="请再次输入密码"
              @keydown.enter.prevent="handleRegister"
            />
          </n-form-item>

          <n-row :gutter="[0, 24]">
            <n-col :span="24">
              <div style="display: flex; justify-content: flex-end">
                <n-button
                  type="primary"
                  @click="handleRegister"
                  :loading="loading"
                  block
                  style="width: 100%"
                >
                  注册
                </n-button>
              </div>
            </n-col>
          </n-row>

          <n-row :gutter="[0, 12]">
            <n-col :span="24">
              <div style="display: flex; justify-content: center; margin-top: 16px">
                <span style="color: #666">已有账号？</span>
                <router-link to="/login" style="margin-left: 8px; color: #18a058; text-decoration: none">
                  立即登录
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
import { register } from '../api/user'

const router = useRouter()
const message = useMessage()

const formRef = ref(null)
const loading = ref(false)

const model = reactive({
  email: '',
  username: '',
  realName: '',
  password: '',
  confirmPassword: ''
})

const rules = {
  email: [
    {
      required: true,
      message: '请输入邮箱',
      trigger: ['input', 'blur']
    },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['input', 'blur']
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: ['input', 'blur']
    },
    {
      min: 6,
      message: '密码长度不能少于6位',
      trigger: ['input', 'blur']
    }
  ],
  confirmPassword: [
    {
      required: true,
      message: '请再次输入密码',
      trigger: ['input', 'blur']
    },
    {
      validator: (rule, value) => {
        return value === model.password
      },
      message: '两次输入的密码不一致',
      trigger: ['input', 'blur']
    }
  ]
}

const handleRegister = (e) => {
  e?.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      loading.value = true
      try {
        const res = await register({
          email: model.email,
          password: model.password,
          username: model.username || undefined,
          realName: model.realName || undefined
        })

        if (res.code === 200) {
          message.success('注册成功！')
          
          // 如果需要邮箱验证，提示用户
          if (res.data?.needsEmailVerification) {
            message.info('请前往邮箱验证后再登录', {
              duration: 3000
            })
          }
          
          // 延迟跳转到登录页
          setTimeout(() => {
            router.push('/login')
          }, 1500)
        }
      } catch (error) {
        // message.error(error.msg || '注册失败')
      } finally {
        loading.value = false
      }
    } else {
      message.error('请填写完整且正确的信息')
    }
  })
}
</script>

<style scoped>
.register-bg {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
