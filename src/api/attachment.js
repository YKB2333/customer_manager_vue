import axios from '@/utils/axios'

export function getAttachmentList(data) { // 商品附件分页查询
  return axios.post('/attachment/selectPage', data)
}

export function downloadAtta(url) { // 下载
  return axios.get(url, {
    responseType: 'blob'
  })
}

export function deleteAtta(id) {
  return axios.delete(`/attachment/delAttachment/${id}`)
}

export function addAtta(data) {
  return axios.post(`/attachment/addAttachment`, data)
}

export function getAttaBrandId(brandId) {
  return axios.get(`/attachment/getByBrandId/${brandId}`)
}
export function upload(action, formData) {
  return axios.post(action, formData)
}