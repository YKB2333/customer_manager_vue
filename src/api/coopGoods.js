import axios from '@/utils/axios'

export function baseInfoPage(params) { // 客户管理中心-客户合作商品数量列表
  return axios.post('/customer/cooperation/baseInfoPage', params )
}


export function getCoopGoods(params) { //  客户管理中心-根据客户id获取合作商品
  return axios.post('/customer/cooperation/getCoopGoods', params )
}

export function syncFromNC(id) { //客户管理中心-同步客户的NC合作商品
  return axios.put(`/customer/cooperation/syncFromNC/${id}`)
}

export function syncFromChannelPrice(id) { //客户管理中心-同步客户的历史报价合作商品
  return axios.put(`/customer/cooperation/syncFromChannelPrice/${id}`)
}

export function goodsPage(customerId, params) { // 客户管理中心-获取客户所属渠道下的商品列表
  return axios.post(`/customer/cooperation/goodsPage/${customerId}`, params)
}

export function batchSaveCoopGoods(params) { // 客户管理中心-批量保存合作商品
  return axios.post(`/customer/cooperation/batchSaveCoopGoods`, params)
}

export function deleteCoopGoods(params) { // 客户管理中心-删除合作商品
  return axios.delete(`/customer/cooperation/deleteCoopGoods`,  {data: params} )
}

export function exportCoopGoods(params) { // 客户管理中心-根据客户id导出合作商品
  return axios.post(`/customer/cooperation/exportCoopGoods`,  params,{ responseType: 'blob' })
}


export function downloadTpl() { // 客户管理中心-合作商品导入模版下载
  return axios.get(`/customer/cooperation/downloadImportCoopGoodsTpl`,{ responseType: 'blob' })
}

export function importCoopGoods(baseInfoId, formData) { // 客户管理中心-批量导入合作商品
  return axios.post(`/customer/cooperation/importCoopGoods/${baseInfoId}`, formData)
}
// /customer/cooperation/importCoopGoods
// 客户管理中心-批量导入合作商品