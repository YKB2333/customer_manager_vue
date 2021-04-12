import axios from '@/utils/axios'

export function spuList(data) {
  return axios.post('/customer/proAnalyze/publishedList',data)
}

