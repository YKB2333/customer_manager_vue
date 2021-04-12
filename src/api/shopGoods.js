import axios from '@/utils/axios'
// 客户管理中心-拜访管理-门店商品信息接口


// 获取门店商品信息列表接口
export function getShopGoodsPages(data) {
  return axios.post(`/customer/visit/shopgoods/getShopGoodsPages`, data)
}

// 获取所有商品分类和品牌
export function getCategorysAndBrands() {
  return axios.get(`/customer/visit/shopgoods/getCategorysAndBrands`)
}
// 下载模板
export function downloadTemplate(data) {
  return axios.post(`/customer/visit/shopgoods/downloadTemplate`, data, { responseType: 'blob' })
}

// 客户编码or客户名称下拉列表
export function choiceNcCodeOrCustomerName(data) {
  return axios.post(`/customer/visit/shopgoods/choiceNcCodeOrCustomerName`, data)
}

// 规格编码or商品名称下拉列表
export function choiceSkuSnOrSpuName(data) {
  return axios.post(`/customer/visit/shopgoods/choiceSkuSnOrSpuName`, data)
}

// 保存门店商品信息
export function saveShopGoods(data) {
  return axios.post(`/customer/visit/shopgoods/saveShopGoods`, data)
}

// 保存门店商品信息
export function deleteShopGoods(id) {
  return axios.get(`/customer/visit/shopgoods/deleteShopGoods/${id}` )
}

// 保存门店商品信息
export function deleteBatchShopGoods(ids) {
  return axios.post('/customer/visit/shopgoods/deleteBatchShopGoods',ids )
}


// 保存门店商品信息
export function importShopGoods(data) {
  return axios.post('/customer/visit/shopgoods/importShopGoods',data )
}

// 导入-批量保存
export function saveBatchShopGoods(data) {
  return axios.post('/customer/visit/shopgoods/saveBatchShopGoods',data )
}