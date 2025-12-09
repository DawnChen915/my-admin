import { toRefs, reactive } from 'vue'
import { useDictStore } from '@/store/modules/dict'

export function useDict(...args) {
  const dictStore = useDictStore()
  const res = reactive({})

  args.forEach((code) => {
    res[code] = []
    const dict = dictStore.getDict(code)

    if (dict.then) {
      dict.then((data) => {
        res[code] = data
      })
    } else {
      res[code] = dict
    }
  })

  return toRefs(res)
}
