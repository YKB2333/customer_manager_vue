import axios from '@/utils/axios'

export function getOperatingModelList(data) {
  return axios.post('/customer/operating-model-info/page', data)
}

export function addOperatingModel(data) {
  return axios.post(`/customer/operating-model-info/save`, data)
}

export function updateOperatingModel(data) {
  return axios.put(`/customer/operating-model-info/update`, data)
}

export function deleteOperatingModel(id) {
  return axios.delete(`/customer/operating-model-info/delete/${id}`)
}

export function release(id) { // 发布
  return axios.put(`/customer/operating-model-info/release/${id}`)
}

export function offline(id) { // 下线
  return axios.put(`/customer/operating-model-info/offline/${id}`)
}

export function getResAcqAtta(id) {
  return axios.get(`/customer/operating-model-info/resAcqAtta/${id}`)
}

export function getScheduleAtta(id) {
  return axios.get(`/customer/operating-model-info/scheduleAtta/${id}`)
}

export function addAtta(data) {
  return axios.post(`/customer/operating-model-info/addAttachment`, data)
}

export function deleteAtta(id) {
  return axios.delete(`/customer/operating-model-info/delAttachment/${id}`)
}

export function saveAchievement(data) {
  return axios.post(`/customer/achievement/save`, data)
}

export function removeAchievement(id) {
  return axios.delete(`/customer/achievement/remove/${id}`)
}

export function pageAchievement(data) {
  return axios.post(`/customer/achievement/page`, data)
}

//竞品分析模块
export function selectPage(data) {
  return axios.post(`/customer/proAnalyze/page`, data)
}
//附件列表
export function attaList(data) {
  return axios.get(`/customer/proAnalyze/attaList/${data}`)
}
//添加附件
export function addAttachment(data) {
  return axios.post(`/customer/proAnalyze/addAtta`,data)
}
//删除附件
export function delAttachment(data) {
  return axios.delete(`/customer/proAnalyze/delAtta/${data}`)
}
//删除竞品分析
export function delCoreSuppliers(data) {
  return axios.delete(`/customer/proAnalyze/delCoreSuppliers/${data}`)
}
//竞品分析附件列表
export function getProAnalyzeAtta(id) {
  return axios.get(`/customer/proAnalyze/attaList/${id}`)
}
//添加竞品分析附件
export function addProAnalyzeAtta(data) {
  return axios.post(`/customer/proAnalyze/addAtta`,data)
}
//删除竞品分析附件
export function delProAnalyzeAtta(id) {
  return axios.delete(`/customer/proAnalyze/delAtta/${id}`)
}
//添加核心客户核心供应商信息
export function saveCoreSuppliers(data) {
  return axios.post(`/customer/proAnalyze/saveCoreSuppliers`,data)
}
//修改核心客户核心供应商信息
export function saveOrUpdateCoreSupplierAnalyze(data) {
  return axios.post(`/customer/proAnalyze/saveOrUpdate`,data)
}
//根据ID获取核心供应商信息
export function getById(data) {
  return axios.get(`/customer/proAnalyze/getCoreSuppliers/${data}`)
}
//经营模块
//客户经营模块列表
export function page(data) {
  return axios.post(`/customer/operating-status/page`,data)
}

//新增客户经营状况
export function add(data) {
  return axios.post(`/customer/operating-status/add`,data)
}

//修改客户经营状况
export function update(data) {
  return axios.post(`/customer/operating-status/update`,data)
}

//删除客户经营状况
export function del(data) {
  return axios.post(`/customer/operating-status/del/${data}`)
}
//年度战略目标管理列表
export function strategicList(data) {
  return axios.post(`/customer/year-target/page`,data)
}
//年度战略目标管理保存
export function strategicSave(data) {
  return axios.post(`/customer/year-target/save`,data)
}
//年度战略目标管理更新
export function strategicUpdate(data) {
  return axios.post(`/customer/year-target/update`,data)
}
//删除年度战略目标
export function delStrategic(id) {
  return axios.delete(`/customer/year-target/delete/${id}`)
}
//年度战略附件列表
export function getStrategicAtta(id) {
  return axios.get(`/customer/year-target/attaList/${id}`)
}
//添加年度战略附件
export function addStrategicAtta(data) {
  return axios.post(`/customer/year-target/addYearTargetAttachment`,data)
}
//删除年度战略附件
export function delStrategicAtta(id) {
  return axios.delete(`/customer/year-target/delYearTargetAttachment/${id}`)
}
//moving
///行动计划列表
export function movingList(data) {
  return axios.post(`/customer/action-info/page`,data)
}
//保存行动计划
export function addMoving(data) {
  return axios.post(`/customer/action-info/save`,data)
}
// 更新行动计划
export function updateMoving(data) {
  return axios.post(`/customer/action-info/update`,data)
}
// 删除行动计划
export function delMoving(id) {
  return axios.delete(`/customer/action-info/delete/${id}`)
}
// 权限判定
export function ruleUpdate(id) {
  return axios.get(`/customer/action-info/update/${id}`)
}
// 行动计划附件列表
export function movingAttaList(id) {
  return axios.get(`/customer/action-info/attaList/${id}`)
}
// 添加行动计划附件
export function addMovingAtta(data) {
  return axios.post(`/customer/action-info/addAttachment`,data)
}
// 删除计划附件列表
export function delMovingAtta(id) {
  return axios.delete(`/customer/action-info/delAttachment/${id}`)
}
//行动计划项目进度列表
export function movingProjectList(id) {
  return axios.get(`/customer/action-info/getProjectSpead/${id}`)
}
//行动计划完结操作
export function endApi(id) {
  return axios.get(`/customer/action-info/end/${id}`)
}
//添加行动计划项目进度
export function addMovingProject(data) {
  return axios.post(`/customer/action-info/addProjectSpead`,data)
}
//更新行动计划项目进度
export function updateMovingProject(data) {
  return axios.post(`/customer/action-info/updateProjectSpead`,data)
}
//删除行动计划项目进度
export function delMovingProject(id) {
  return axios.delete(`/customer/action-info/delProjectSpead/${id}`)
}
