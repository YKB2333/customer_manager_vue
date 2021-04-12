import axios from '@/utils/axios'

export function getCategoryList(data) { // 分类列表
  return axios.post('/goods/category/getCategoryPager', data)
}

export function showCategory(id) { // 显示分类
  return axios.put(`/goods/category/show/${id}`)
}

export function hideCategory(id) { // 隐藏分类
  return axios.put(`/goods/category/hide/${id}`)
}

export function deleteCategory(id) { // 删除分类
  return axios.delete(`/goods/category/delete/${id}`)
}

export function addCategory(data) { // 添加分类
  return axios.post(`/goods/category/addCategory`, data)
}

export function updateCategory(data) { // 修改分类
  return axios.post(`/goods/category/updateCategory`, data)
}