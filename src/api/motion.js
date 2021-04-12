// 提案与成功案例
import axios from '@/utils/axios'

export function getMotionList(data) { //获取列表
  return axios.post('/customer/proposals-success/page', data)
}

export function getAttaList(data) { //附件列表 baseInfoId  type 4成功案例 2提案
  return axios.post(`/customer/proposals-success/attaList`,data)
}

export function delAttachment(id) { //删除附件
  return axios.delete(`/customer/proposals-success/delAttachment/${id}`)
}

export function addAttachment(data) { //添加合同附件 type 1成功案例 2提案
  return axios.post(`/customer/proposals-success/addAttachment`,data)
}
