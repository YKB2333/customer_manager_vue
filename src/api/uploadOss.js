import axios from '@/utils/axios'

export function uploadOss(data) { // 客户附件上传
  return axios.post('uploadCustomerAtta', data)
}

export function uploadOperateOss(data) { // 运营方式附件上传
  return axios.post('uploadOperatingModelAttaFile', data)
}

export function uploadGoodsImages(data) { // 商品图片上传
  return axios.post('uploadGoodsImages', data)
}

export function uploadShopAtta(data) { // 店铺附件上传
  return axios.post('uploadShopAtta', data)
}

export function uploadShopLogo(data) { // 店铺logo上传
  return axios.post('uploadShopLogo', data)
}

export function uploadContractAtta(data) { // 合同附件上传
  return axios.post('uploadContractAtta', data)
}

export function uploadProAnalyzeAtta(data) { // 竞品附件上传
  return axios.post('uploadProAnalyzeAtta', data)
}

export function uploadContactsIDcard(data) { // 客户联系人附件上传
  return axios.post('uploadContactsIDcard', data)
}
