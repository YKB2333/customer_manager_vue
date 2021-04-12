import axios from "@/utils/axios";
import { data } from "autoprefixer";

// 客户管理中-店铺管理-分页列表
export function getShopPages(data) {
  return axios.post("/customer/visit/shopInfo/getShopPages", data);
}

// 客户管理中-店铺管理-启用
export function enable(id) {
  return axios.get(`/customer/visit/shopInfo/enable/${id}`);
}

// 客户管理中-店铺管理-禁用
export function disable(id) {
  return axios.get(`/customer/visit/shopInfo/disable/${id}`);
}

// 客户管理中-店铺管理-获取可选择客户
export function getCustomersPages(data) {
  return axios.post(`/customer/visit/shopInfo/getCustomersPages`, data);
}

// 客户管理中-店铺管理-分页列表
export function getBrandPages(data) {
  return axios.post("/customer/visit/shopInfo/getBrandPages", data);
}

// 客户管理中-店铺管理-新增-保存
export function saveShopInfo(data) {
  return axios.post("/customer/visit/shopInfo/saveShopInfo", data);
}

// 客户管理中-店铺管理-修改-保存
export function updateShopInfo(data) {
    return axios.post("/customer/visit/shopInfo/updateShopInfo", data);
  }

// 客户管理中-店铺管理-删除店铺
export function deleteShop(id) {
    return axios.get(`/customer/visit/shopInfo/deleteShop/${id}`);
  }

  // 客户管理中-店铺管理-列表-编辑排序
export function editSort(data) {
  return axios.post("/customer/visit/shopInfo/editSort", data);
}


  // 客户管理中-店铺管理-新增/修改-获取可平台名称
  export function getAllOnlineNames() {
    return axios.get("/customer/visit/shopInfo/getAllOnlineNames");
  }

// 客户管理中-店铺详情获取
export function getShopDetail(id) {
  return axios.get(`/customer/visit/shopInfo/getShopDetail/${id}`);
}

// 客户管理中-店铺提交审核
export function approvalShop(data) {
  return axios.put(`/customer/visit/shopInfo/approval`,data);
}

// 客户管理中-审核记录
export function getWorkflow(shopId) { // 获取地区数据
  return axios.get(`/customer/visit/shopInfo/getWorkflow/${shopId}`)
}

