import axios from '@/utils/axios'

export function getProjectList(data) {
  return axios.post('/customer/project/page', data)
}

export function saveProject(data) {
  return axios.post(`/customer/project/save`, data)
}

export function deleteProject(id) {
  return axios.delete(`/customer/project/delete/${id}`)
}

export function getAttaList(id) {
  return axios.get(`/customer/project/attaList/${id}`)
}

export function addAtta(data) {
  return axios.post(`/customer/project/addAttachment`, data)
}

export function deleteAtta(id) {
  return axios.delete(`/customer/project/delAttachment/${id}`)
}