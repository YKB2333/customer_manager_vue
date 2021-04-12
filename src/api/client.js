import axios from '@/utils/axios'

// 客户管理中-获取地区数据
export function getDistrictList(data) { // 获取地区数据
  return axios.post('/customer/amap-district/getDistrictList', data)
}

// 客户管理中-审核记录
export function getWorkflow(baseInfoId) { // 获取地区数据
  return axios.get(`/customer/base-info/getWorkflow/${baseInfoId}`)
}

// 客户管理中心- 客户信息接口
export function addSaveBaseInfo(data) { // 添加客户基础信息
  return axios.post('/customer/base-info/saveBaseInfo', data)
}

export function saveCompeteInfo(data) { // 添加客户竞品或竞争对手信息
  return axios.post('/customer/base-info/saveCompeteInfo', data)
}

export function saveShopInfo(data) { // 添加客户店铺信息
  return axios.post('/customer/base-info/saveShopInfo', data)
}

export function updateBaseInfo(data) { // 修改客户基础信息
  return axios.post('/customer/base-info/updateBaseInfo', data)
}

export function updateCompeteInfo(data) { // 修改客户竞品或竞争对手信息
  return axios.post('/customer/base-info/updateCompeteInfo', data)
}
export function updateShopInfo(data) { // 修改客户店铺信息
  return axios.post('/customer/base-info/updateShopInfo', data)
}
export function delShopInfo(data) { // 客户管理中心-删除客户店铺信息
  return axios.delete(`/customer/base-info/delShopInfo/${data}`)
}

export function uploadCustomerLogo(data) { // 用户头像
  return axios.post('/uploadCustomerLogo', data)
}
export function uploadCustomerAtta(data) { //k客附件上传
  return axios.post('/uploadCustomerAtta', data)
}

// 审核接口
export function getHandleKey(data) { // 调用审核接口必要参数
  return axios.get(`/open/customer/base-info/getHandleKey/${data}`)
}
export function openCheckedStatus(baseInfoId, handleKey) { // 客户信息审核通过
  return axios.put(`/open/customer/base-info/openCheckedStatus/${baseInfoId}/${handleKey}`)
}
export function closeCheckedStatus(baseInfoId, handleKey) { // 客户信息审核不通过
  return axios.put(`/open/customer/base-info/closeCheckedStatus/${baseInfoId}/${handleKey}`)
}

export function getCompeteInfoListByBaseInfoId(data) { // 根据客户基础信息id获取客户竞品或竞争对手信息列表
  return axios.get(`/customer/base-info/getCompeteInfoListByBaseInfoId/${data}`)
}
export function getShopInfoListByBaseInfoId(data) { //-根据店铺基础信息id获取客户店铺信息列表
  return axios.get(`/customer/base-info/getShopInfoListByBaseInfoId/${data}`)
}


export function openEnableStatus(data) { // 启动客户
  return axios.put(`/customer/base-info/openEnableStatus/${data}`)
}
export function closeEnableStatus(data) { // 停用客户
  return axios.put(`/customer/base-info/closeEnableStatus/${data}`)
}

export function selectPage(data) { // 客户基础信息分页列表
  return axios.post('/customer/base-info/selectPage', data)
}

export function selectLagUserPage(data) { // 滞后客户基础信息分页列表
  return axios.post('/customer/base-info/selectLagUserPage', data)
}

export function getBaseInfoById(data) { // 根据id获取客户基础信息
  return axios.get(`/customer/base-info/getBaseInfoById/${data}`, data)
}

export function getBaseInfoTempById(data) { // 根据id获取临时表客户基础信息
  return axios.get(`/customer/base-info/getBaseInfoTempById/${data}`, data)
}
export function applyByBaseInfoId(data) { // 建档审批
  return axios.get(`/customer/base-info/applyByBaseInfoId/${data}`)
}

export function findAll(data) { // 客户渠道类型
  return axios.get('/nc-base-info/channel')
}
export function findAllBankCategory(data) { // 银行类型
  return axios.get('/customer/nc-bank-category/getAllNcBankCategory')
}


export function getNcCusCategoryList(data) { // 客户管理中心-获取客户分类列表
  return axios.get(`/customer/nc-cus-category/getNcCusCategoryList/?isOneLevel=${data.isOneLevel}&parentId=${data.parentId}`)
}
export function getAllNcCusCategory() { // 客户管理中心-获取客户分类列表new
  return axios.get(`/customer/nc-cus-category/getAllNcCusCategory`)
}
// 三大中心-泛微用户接口
export function getAllEcologyUsers(data) { // 获取所有泛微用户
  return axios.get('/ecology-user/getAllEcologyUsers', data)
}
export function getDepartment(data) { // 获取所有部门
  return axios.get(`/ecology-user/getAllDeportment/${data}`)
}
export function getAllCompanyInfo(data) { // 获取所有公司
  return axios.get('/ecology-user/getAllCompanyInfo', data)
}
export function getOAThreeSub(data) { // 获取所有公司/新！添加三级
  return axios.get('/ecology-user/getOAThreeSub', data)
}
export function getEcologyUserByMobile(mobile) { // 根据部门获取用户
  return axios.put(`/ecology-user/getEcologyUserByMobile`, {mobile})
}
export function getEcologyUsersByDept(data) { // 根据部门获取用户
  return axios.get(`/ecology-user/getEcologyUsersByDept/${data}`)
}
export function getJobTitleById(data) { // 根据id获取负责内容信息
  return axios.get(`/ecology-user/getJobTitleById/${data}`)
}
// 标签接口
export function getTagListById(data) { // 客户管理中心-根据客户id获取标签
  return axios.get(`/customer/base-info/getTagListById/${data}`)
}
export function updateTagById(data) { // 客户管理中心-更新客户获取标签
  return axios.post(`/customer/base-info/updateTagById/`,data)
}
//店铺附件接口
export function addShopAttachment(data) { // 客户管理中心-添加店铺附件
  return axios.post(`/customer/base-info/addShopAttachment/`,data)
}
export function delAttachment(data) { // 客户管理中心-根据id删除店铺附件
  return axios.delete(`/customer/base-info/delShopAttachment/${data}`)
}
export function ShopAttaList(data) { // 客户管理中心-获取店铺附件列表
  return axios.get(`/customer/base-info/ShopAttaList/${data}`)
}
//客户联系人接口
export function getContactsInfoListById(data) { // 客户管理中心-客户联系人信息列表
  return axios.get(`/customer/base-info/getContactsInfoListByBaseInfoId/${data}`)
}
export function addContactsInfoId(data) { // 客户管理中心-新增客户联系人信息
  return axios.post(`/customer/base-info/addContactsInfoId/`,data)
}
export function updateContactsInfoById(data) { // 客户管理中心-修改客户联系人信息
  return axios.post(`/customer/base-info/updateContactsInfoById/`,data)
}
export function delContactsInfoById(data) { // 客户管理中心-删除客户联系人信息
  return axios.delete(`/customer/base-info/delContactsInfoById/${data}`)
}
//内部联系人接口
export function getInnerPersonInfoListByBId(data) { // 客户管理中心-内部联系人信息列表
  return axios.get(`/customer/base-info/getInnerPersonInfoListByBId/${data}`)
}
export function addInnerPersonInfoById(data) { // 客户管理中心-新增内部联系人信息
  return axios.post(`/customer/base-info/addInnerPersonInfoById/`,data)
}
export function updateInnerPersonInfoById(data) { // 客户管理中心-修改内部联系人信息
  return axios.post(`/customer/base-info/updateInnerPersonInfoById/`,data)
}
export function delInnerPersonInfoById(data) { // 客户管理中心-删除内部联系人信息
  return axios.delete(`/customer/base-info/delInnerPersonInfoById/${data}`)
}
//客户合作信息接口
export function addCoopInfo(data) { // 客户管理中心-新增客户合作信息
  return axios.post(`/customer/base-info/addCoopInfo/`,data)
}
export function updateCoopInfoById(data) { // 客户管理中心-修改客户合作信息
  return axios.post(`/customer/base-info/updateCoopInfoById/`,data)
}
export function deleteCoopInfoById(data) { // 客户管理中心-删除客户合作信息
  return axios.delete(`/customer/base-info/deleteCoopInfoById/${data}`)
}
export function getCoopInfoListByBaseInfoId(data) { // 客户管理中心-根据客户id获取所有合作信息列表
  return axios.get(`/customer/base-info/getCoopInfoListByBaseInfoId/${data}`)
}
//NC接口
export function getNcOrgs(){
  return axios.get(`/nc-base-info/orgs`)
}
export function getNcOrgsDepartment(){
  return axios.get(`/nc-base-info/orgs/department`)
}
//nc结算方式接口
export function getNcCloseMethod(){
  return axios.get(`/nc-base-info/orgs/closeMethod`)
}

//nc结算方式接口
export function download(data){
  return axios.post(`/customer/base-info/downLoad`,data,{ responseType: 'blob' })
}

// 删除客户
export const deleteCustomerLevel = (ids) => axios.delete(`/customer/base-info/removeCustomerLevel`, {data: ids})

// 导入A类客户
export const importCustomerLevel = (data) => axios.post(`/customer/base-info/importLevelACustomer`, data)

// 下载A类模版
export const downloadCustomerLevelTmpl = () => axios.get(`/customer/base-info/exportCustomerLevelTemplate`, { responseType: 'blob' })