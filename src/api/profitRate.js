// 客户管理中-客户管理-利润率档案接口
import axios from "@/utils/axios";

// 获取列表数据
export function getProfitRatePages(data) {
  return axios.post("/customer/base-info/profit-rate/getProfitRatePages", data);
}

// 审核记录
export function getWorkflow(applyId) { // 获取地区数据
  return axios.get(`/customer/channelOfferApply/getWorkflow/${applyId}`)
}

// 新增-保存  
export function saveProfitRate(data) {
  return axios.post("/customer/base-info/profit-rate/saveProfitRate", data);
}
// 编辑-保存  
export function editProfitRate(data) {
  return axios.post("/customer/base-info/profit-rate/editProfitRate", data);
}
// 删除
export function deleteProfitRate(id) {
  return axios.get(`/customer/base-info/profit-rate/deleteProfitRate/${id}`);
}

// 获取操作日志列表  
export function getModifyLogPages(data) {
  return axios.post("/customer/base-info/profit-rate/getModifyLogPages", data);
}



// 客户管理中-客户管理-服务费档案接口
// 获取服务费档案列表数据
export function getChannelServiceFeePages(data) {
  return axios.post("/customer/channelServiceFee/page", data);
}
// 服务费档案新增-保存  
export function saveChannelServiceFee(data) {
  return axios.post("/customer/channelServiceFee/save", data);
}
// 服务费档案编辑-保存  
export function editChannelServiceFee(data) {
  return axios.post("/customer/channelServiceFee/update", data);
}
// 服务费档案删除
export function deleteChannelServiceFee(id) {
  return axios.put(`/customer/channelServiceFee/delete/${id}`);
}
// 服务费档案启用
export function enableChannelServiceFee(id) {
  return axios.put(`/customer/channelServiceFee/enable/${id}`);
}
// 服务费档案禁用
export function disableChannelServiceFee(id) {
  return axios.put(`/customer/channelServiceFee/disable/${id}`);
}


// 客户管理中-客户管理-定价申请接口
// 获取定价申请单列表数据
export function getChannelOfferApplyPages(data) {
  return axios.post("/customer/channelOfferApply/page", data);
}
// 定价申请单新增-保存  
export function saveChannelOfferApply(data) {
  return axios.post("/customer/channelOfferApply/save", data);
}
// 获取定价申请单数据
export function getChannelOfferApply(id) {
  return axios.get(`/customer/channelOfferApply/get/${id}`);
}

// 获取定价申请单商品数据
export function getListGoods(id) {
  return axios.get(`/customer/channelOfferApply/listGoods/${id}`);
}

// 定价申请单修改-保存  
export function updateApplyGoods(data) {
  return axios.post("/customer/channelOfferApply/update", data);
}
// 定价申请单作废
export function cannelChannelOfferApply(id) {
  return axios.put(`/customer/channelOfferApply/cannel/${id}`);
}

// 定价申请单提审
export function channelOfferApply(id) {
  return axios.put(`/customer/channelOfferApply/apply/${id}`);
}
//商品价格查询
export function importGoods(data) {
  return axios.post("/customer/channelOfferApply/importGoods", data);
}
export function importValidate(data) {
  return axios.post("/customer/channelOfferApply/importValidate", data);
}
// 查询渠道定价申请单审批记录
export function listApplyLog(id) {
  return axios.get(`/customer/channelOfferApply/listApplyLog/${id}`);
}
export function downloadChannelOfferApplyTmpl() {
  return axios.get(`/customer/channelOfferApply/exportChannelApplyTemplate`, { responseType: 'blob' });
} 
//获取修改记录信息
export function getOfferModifyLogPages(data){
  return axios.post("/customer/channelOfferApply/getModifyLogPages", data);
}



// 客户管理中-客户管理-历史合作价格接口
// 获取历史合作价格列表数据
export function channelOfferApplyHistoryPages(data) {
  return axios.post("/customer/channelOfferApplyHistory/page", data);
}


