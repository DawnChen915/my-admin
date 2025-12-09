import axios from 'axios'

export const getDictList = (code) => {
  return axios.get('/api/dict/list', { params: { code } })
}
