import axios from '@/utils/axios'

export function cancelVisit(data) {//客户拜访计划-取消
  return axios.post('/customer/visitPlan/cancel',data)
}
export function getPlanApprovalLogs(id) {//客户拜访计划日志列表
    return axios.get(`/customer/visitPlan/log/getPlanApprovalLogs/${id}`)
  }
export function getOneVisitPlan(id) {//获取单个客户拜访计划
  return axios.get(`/customer/visitPlan/getOneVisitPlan/${id}`)
}

export function getVisitPlans(data) {//查询条件获取客户拜访计划列表
  return axios.post('/customer/visitPlan/getVisitPlans',data)
}

export function submitForReview(id) {//客户拜访计划-提交审核
  return axios.get(`/customer/visitPlan/submitForReview/${id}`)
}

export function updateVisitPlan(data) {//客户拜访计划-编辑保存
  return axios.post('/customer/visitPlan/updateVisitPlan',data)
}

export function saveVisitPlan(data) {//客户拜访计划-新增保存
    return axios.post('/customer/visitPlan/saveVisitPlan',data)
}

export function approval(data) {//客户拜访计划-审批操作
    return axios.post('/customer/visitPlan/approval',data)
}

export function calendarShow(id) {//客户拜访计划-日历展示
    return axios.get(`/customer/visitPlan/calendarShow/${id}`)
}

export function getVisitTaskOptions(data) {//客户拜访计划-根据任务类型，获取任务选择列表
    return axios.post('/customer/visitPlan/getVisitTaskOptions',data)
}

export function getVisitPlanApproveds(data) {//客户拜访计划-根据任务类型，获取任务选择列表
  return axios.post('/customer/visitPlan/getVisitPlanApproveds',data)
}

// 拜访任务
export function adjust(data) {// 客户拜访任务-调整
  return axios.post('/customer/visitTask/adjust',data)
}

export function cancel(data) {//客户拜访任务-取消
  return axios.post('/customer/visitTask/cancel',data)
}

export function TaskgetOneVisitPlan(id) {//客户拜访任务-获取单个客户拜访任务
  return axios.get(`/customer/visitTask/getOneVisitTask/${id}`)
}

export function getSkusByTaskId(data) {//客户拜访任务-任务商品信息
  return axios.post('/customer/visitTask/getSkusByTaskId',data)
}

export function getVisitTaskPage(data) {//客户拜访任务-获取拜访任务列表
  return axios.post('/customer/visitTask/getVisitTaskPage',data)
}

export function getTaskApprovalLogs(id) {//客户拜访任务-客户拜访任务日志列表
  return axios.get(`/customer/visitTask/log/getTaskApprovalLogs/${id}`)
}


export function exportTasks(data){
  return axios.post(`/customer/visitTask/exportTasks`,data,{ responseType: 'blob' })
}

export function downLoadPic(data) {//客户拜访任务-下载商品图
  return axios.post('/customer/visitTask/downLoadPic',data,{responseType: 'blob' })
}

export function batchDownLoadPic(data) {//客户拜访任务-批量下载多任务商品图
  return axios.post('/customer/visitTask/batchDownLoadPic',data,{responseType: 'blob' })
}