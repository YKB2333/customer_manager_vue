import axios from '@/utils/axios'

export function getActivityList(data) {
  return axios.post('/customer/activity/page', data)
}

export function saveActivity(data) { //新增活动
  return axios.post(`/customer/activity/save`, data)
}

export function deleteActivity(id) {
  return axios.delete(`/customer/activity/delete/${id}`)
}

export function getAttaList(id) {
  return axios.get(`/customer/activity/attaList/${id}`)
}

export function addAtta(data) {
  return axios.post(`/customer/activity/addAttachment`, data)
}

export function deleteAtta(id) {
  return axios.delete(`/customer/activity/delAttachment/${id}`)
}


export function custPage(params) {  // 客户管理中心 - 活动客户列表
  return axios.post(`/customer/activity/custPage`, params)
}

export function delCust(ids) {  // 客户管理中心 - 删除活动客户
  return axios.delete(`/customer/activity/delCust`, { data: ids })
}


export function addCust(params) {  // 客户管理中心 - 添加活动客户 activityId, baseInfoId id[]
  return axios.post(`/customer/activity/addCust`, params)
}


export function exportCust(params) {  // 客户管理中心 - 活动客户导出
  return axios.post(`/customer/activity/exportCust`, params, { responseType: 'blob' })
}

export function goodsPage(params) {  // 客户管理中心 - 活动商品列表
  return axios.post(`/customer/activity/goodsPage`, params)
}

export function delGoods(ids) {  // 客户管理中心 - 删除活动商品
  return axios.delete(`/customer/activity/delGoods`, { data: ids })
}

export function addGoods(activityId, params) {  // 客户管理中心 - 添加活动商品
  return axios.post(`/customer/activity/addGoods/${activityId}`, params)
}

export function getSkuPager(params) {  // 客户管理中心 - 活动商品列表
  return axios.post(`/goods/sku/getSkuVoPager`, params)
}

export function exportGoods(params) {  // 客户管理中心 - 活动客户导出
  return axios.post(`/customer/activity/exportGoods`, params, { responseType: 'blob' })
}

export function getActivityById(id) {  // 客户管理中心 - 查询详情
  return axios.get(`/customer/activity/detail/${id}`)
}

export function update(params) {  // 客户管理中心 - 修改活动
  return axios.post(`/customer/activity/update`, params)
}
// /admin/customer / activity / update
// 客户管理中心 - 修改活动
