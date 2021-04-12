import axios from '@/utils/axios'
// 下载模板
export function downloadCategoryTemplate() {
  return axios.post(`/customer/visitGoodsCategory/downloadCategoryTemplate`, {},{ responseType: 'blob' })
}
// 导入
export function importCategory(formData) {
  return axios.post(`/customer/visitGoodsCategory/importCategory`,formData)
}

// 获取客户下的分类
export function getAllCategory(data) {
    return axios.get(`/customer/visitGoodsCategory/getAllCategory/${data}`)
  }
// 获取可选择的客户
export function getCustomers() {
    return axios.get('/customer/visitGoodsCategory/getCustomers')
  }
// 获取当前选择的客户下的所有一级分类
export function getFirstCategorys(data) {
  return axios.get(`/customer/visitGoodsCategory/getFirstCategorys/${data}`)
}
// 添加分类
export function saveCategory(data) {
  return axios.post(`/customer/visitGoodsCategory/saveCategory`,data)
}
// 修改分类
export function updateCategory(data) {
  return axios.post(`/customer/visitGoodsCategory/updateCategory`,data)
}

// 修改分类
export function daleteCategory(data) {
  return axios.post(`/customer/visitGoodsCategory/deleteCategory`,data)
}

// 获取单个分类
export function getOneCategory(data) {
  return axios.get(`/customer/visitGoodsCategory/getOneCategory/${data}`)
}

