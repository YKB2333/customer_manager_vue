import axios from '@/utils/axios'

export function getContractList(data) { //获取合同列表
  return axios.post('/customer/contract/page', data)
}

export function saveContract(data) { //保存合同
  return axios.post(`/customer/contract/save`, data)
}
export function updateContract(data) { //保存合同
  return axios.post(`/customer/contract/update`, data)
}

export function deleteContract(id) { //删除合同
  return axios.delete(`/customer/contract/delete/${id}`)
}

export function delAttachment(id) { //删除附件
  return axios.delete(`/customer/contract/delAttachment/${id}`)
}

export function getAttaList(id) { //合同附件列表
  return axios.get(`/customer/contract/attaList/${id}`)
}

export function addAttachment(data) { //添加合同附件
  return axios.post(`/customer/contract/addAttachment`,data)
}

export function getAllCompanyInfo() { //签约主体列表(公司所有信息)
  return axios.get(`/ecology-user/getAllCompanyInfo`)
}
