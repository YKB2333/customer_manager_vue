// 项目所有模块通用的api

import axios from '@/utils/axios'

export function getLogPages(params) {  // 操作日志 
  return axios.post(`/common/operationLog/getModifyLogPages`, params)
}