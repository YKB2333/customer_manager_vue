import axios from '@/utils/axios'

export function getBrandList(data) { // 品牌列表
  return axios.post('/goods/brand/getBrandPager', data)
}

export function getAttaCounts(brandIds) { // 获取附件数量
  return axios.post(`/attachment/getCountByBrandId`, brandIds)
}

export function disEnable(brandId) { // 禁用品牌
  return axios.put(`/goods/brand/disEnable/${brandId}`)
}

export function enable(brandId) { // 启用品牌
  return axios.put(`/goods/brand/enable/${brandId}`)
}

export function addBrand(data) { // 添加品牌
  return axios.post(`/goods/brand/addBrand`, data)
}

export function updateBrand(data) { // 修改品牌
  return axios.post(`/goods/brand/updateBrand`, data)
}