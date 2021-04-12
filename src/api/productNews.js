import axios from '@/utils/axios'

export function getProductNewsList(data) {
  return axios.post('/customer/product-news/page', data)
}

export function saveProductNews(data) {
  return axios.post(`/customer/product-news/save`, data)
}

export function deleteProductNews(id) {
  return axios.delete(`/customer/product-news/delete/${id}`)
}

// export function getAttaList(id) {
//   return axios.get(`/customer/product-news/attaList/${id}`)
// }

// export function addAtta(data) {
//   return axios.post(`/customer/product-news/addAttachment`, data)
// }

// export function deleteAtta(id) {
//   return axios.delete(`/customer/product-news/delAttachment/${id}`)
// }