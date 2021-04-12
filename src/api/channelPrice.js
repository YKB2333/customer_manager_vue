import axios from '@/utils/axios'
// 获取可选择店铺
export function getchoiceShopInfos(customerId) {
  return axios.get(
    `/customer/base-info/channel-price/query/getchoiceShopInfos/${customerId}`
  )
}
// 获取可选择客户
export function getchoiceCustomers() {
  return axios.post(
    `/customer/base-info/channel-price/query/getchoiceCustomers`
  )
}
// 获取可选择品牌  /getchoicebrandsByCateCode/{cateCode}
export function getchoicebrands() {
  return axios.get(`/customer/base-info/channel-price/query/getchoicebrands`)
}

// 通过分类id获取可选择品牌  
export function getchoicebrandsByCateCode(cateCode) {
  return axios.get(`/customer/base-info/channel-price/query/getchoicebrandsByCateCode/${cateCode}`)
}
// 获取可选择商品分类
export function getchoiceCategorys() {
  return axios.get(`/customer/base-info/channel-price/query/getchoiceCategorys`)
}

// 获取渠道报价查询商品列表
export function getChannelPriceQueryGoodsPages(data) {
  return axios.post('/customer/base-info/channel-price/query/getChannelPriceQueryGoodsPages',data)
}

// 获取服务费
export function getServiceFee(data) {
  return axios.post('/customer/base-info/channel-price/query/getServiceFee',data)
}
// 导出
export function channelPriceQueryexport(data) {
  return axios.post('/customer/base-info/channel-price/query/channelPriceQueryexport',data)
}
// 获取渠道报价查询商品导出日志记录
export function getChannelPriceExportLogPages(data) {
  return axios.post('/customer/base-info/channel-price/query/getChannelPriceExportLogPages',data)
}
// 下载模板
export function download(data) {
  return axios.post(`/customer/base-info/channel-price/query/downLoad`, data,{ responseType: 'blob' })
}
