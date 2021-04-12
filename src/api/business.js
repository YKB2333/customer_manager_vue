import axios from '@/utils/axios'

export function getList(data) {
  return axios.post('/customer/business/list',data)
}
export function save(data) {
  return axios.post('/customer/business/save',data)
}
export function update(data) {
  return axios.post('/customer/business/update',data)
}
export function del(id) {
  return axios.delete(`/customer/business/delete/${id}`)
}
export function deleteOrganization(id) {
  return axios.delete(`/customer/business/deleteOrganization/${id}`)
}
//添加组织(公司-部门)
export function saveOrganization(data) {
  return axios.post(`/customer/business/saveOrganization`,data)
}

export function edit(data) {
  return axios.post('/customer/business/update',data)
}
//修改组织(公司-部门)
// export function updateOrganization(data) {
//   return axios.post(`/customer/business/saveOrganization/`,data)
// }

// //删除组织(公司-部门)
// export function updateOrganization(data) {
//   return axios.post(`/customer/business/saveOrganization/${data}`,)
// }

//删除组织(公司-部门)
// export function listOrganization(data) {
//   return axios.post(`/customer/business/listOrganization/${data}`,)
// }

// //业务板块列表
export function listOrganization(data) {
  return axios.get(`/customer/business/listOrganization/${data}`)
}

export function listBusiness() { //只获取版块
  return axios.get(`/customer/business/listBusiness`)
}

export function userList(roleCode) { //只获取版块
  return axios.get(`/customer/business/userList/${roleCode}`)
}


