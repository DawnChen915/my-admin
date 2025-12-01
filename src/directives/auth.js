import { useUserStore } from '@/store/modules/user'

/**
 * v-auth
 * 按钮权限指令
 */
export const auth = {
  mounted(el, binding) {
    const { value } = binding
    const userStore = useUserStore()
    const roles = userStore.roles

    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value
      const hasPermission = roles.some(role => {
        return permissionRoles.includes(role)
      })

      if (!hasPermission) {
        if (el.parentNode) {
          el.parentNode.removeChild(el)
        }
      }
    } else {
      throw new Error(`need roles! Like v-auth="['admin','editor']"`)
    }
  }
}
