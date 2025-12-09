import { defineStore } from 'pinia'
import { getDictList } from '@/api/dict'

export const useDictStore = defineStore('dict', {
  state: () => ({
    dictMap: {}
  }),
  actions: {
    async getDict(code) {
      
      if (this.dictMap[code]) {
        return this.dictMap[code]
      }
      try {
        const res = await getDictList(code)
        // 假设 axios 拦截器已经处理了 res.data
        const data = res.data.data || res.data
        this.dictMap[code] = data
        return data
      } catch (error) {
        console.error(error)
        return []
      }
    }
  }
})
