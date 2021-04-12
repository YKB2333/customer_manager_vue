import axios from '@/utils/axios'

export function findSpuInfo(name) { // 获取商品信息
  return axios.get(`report/sales/getSpuInfo?name=${name}`)
}

export function findCustomerInfo(name) { // 获取客户信息
  return axios.get(`report/sales/getCustomerInfo?name=${name}`)
}

export function getTotalAmt(data) { // 销售总额
  return axios.post('report/sales/totalAmt', data)
}

export function getBrandCategorySales(data) { // 商品服务类型销售分析报表
  return axios.post(`report/sales/brandCategory`, data)
}

export function getBrandSales(data) { // 商品品牌销售分析报表
  return axios.post(`report/sales/brand`, data)
}

export function getCategorySales(data) { // 商品品类销售分析报表
  return axios.post(`report/sales/category`, data)
}

export function getGoodsSales(data) { // 商品销售分析报表
  return axios.post(`report/sales/goods`, data)
}

export function getOrgSales(data) { // 销售组织销售分析报表
  return axios.post(`report/sales/org`, data)
}

export function getChannelSales(data) { // 客户渠道销量报表
  return axios.post('report/customer/channel', data)
}

export function getCustomerSales(data) { // 客户销量报表
  return axios.post('report/customer/consume', data)
}

export function getCustomerRank(data) { // 客户销量排行
  return axios.post('report/customer/customerRank', data)
}

export function getChannelRank(data) { // 客户渠道销量排行
  return axios.post('report/customer/channelRank', data)
}

export function getCustomerGrowth(data) { // 客户环比分析图表
  return axios.post(`report/customer/ringGrowth/customer`, data)
}

export function getChannelGrowth(data) { // 客户渠道环比分析图表
  return axios.post(`report/customer/ringGrowth/channel`, data)
}

export function getUnkonwGoods(data) { // 未分类商品销量排行
  return axios.post(`report/goods/unkonwGoods`, data)
}

export function getUnkonwGoodsTotalAmt(data) { // 未分类商品销量总额
  return axios.post(`report/sales/unknowGoodsTotalAmt`, data)
}

export function getBrandCategoryGrowth(data) { // 商品服务类型环比分析图表
  return axios.post(`report/goods/ringGrowth/brandCategory`, data)
}

export function getBrandGrowth(data) { // 商品品牌环比分析图表
  return axios.post(`report/goods/ringGrowth/brand`, data)
}

export function getCategoryGrowth(data) { // 商品品类环比分析图表
  return axios.post(`report/goods/ringGrowth/category`, data)
}

export function getGoodsGrowth(data) { // 商品品类环比分析图表
  return axios.post(`report/goods/ringGrowth/goods`, data)
}

export function getBrandCategoryRank(data) { // 商品服务类型销量排行
  return axios.post(`report/goods/brandCategoryRank`, data)
}

export function getBrandRank(data) { // 商品品牌销量排行
  return axios.post(`report/goods/brandRank`, data)
}

export function getCategoryRank(data) { // 商品品类销量排行
  return axios.post(`report/goods/categoryRank`, data)
}

export function getGoodsRank(data) { // 商品销量排行
  return axios.post(`report/goods/goodsRank`, data)
}
