import axios from '@/utils/axios'

export function getAllBaseInfoList() {
  return axios.get('/customer/base-info/simpleBaseInfo')
}

export function getEnableList() {
  return axios.get('/customer/base-info/enablenBaseInfo')
}

export function baseInfoRatePage(data) {
  return axios.post('/customer/base-info/baseInfoRatePage', data)
}

export function exportBaseInfoRate(data){
  return axios.post(`/customer/base-info/exportBaseInfoRate`,data,{ responseType: 'blob' })
}

export function reflushBaseInfoRatePage(data){
  return axios.put(`/customer/base-info/reflushBaseInfoRatePage`,data)
}
