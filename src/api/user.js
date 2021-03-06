import axios from '@/utils/axios'
import { apiAgent } from '@/config'
let Base64 = require('js-base64').Base64
// 登录
export function login(account, pwd) {
  return axios.post(`/account/login`, {
    account: account,
    pwd: Base64.encode(pwd)
  })
}
// 修改密码
export function modifyPwd(data) {
  return axios.post(`/account/modifyPwd`, {
    id: data.userId,
    oldPassword: Base64.encode(data.oldPassword),
    newPassword: Base64.encode(data.newPassword)
  })
}

export function sendSms(mobile) { // 发送短信验证码
  return axios.put(`/account/sendFindPwdSms`, { mobile })
}

export function sendEmail(email) { // 发送邮件
  return axios.put(`/account/sendFindPwdEmail?email=${email}`)
}

export function verifyEmailTokenAndModifyPwd(newPwd, token) {
  return axios.post(`/account/verifyEmailTokenAndModifyPwd`, {
    newPwd: Base64.encode(newPwd),
    token: token
  })
}

export function verifyFindCodeAndModifyPwd(code, mobile, newPwd) {
  return axios.post(`/account/verifyFindCodeAndModifyPwd`, {
    code: code,
    mobile: mobile,
    newPwd: Base64.encode(newPwd)
  })
}

export function getNoticePage(query) { // 分页获取notice
  return axios.post(`/common/msg/noticePage`, query)
}

export function getNoticeById(id) { // 留言明细
  return axios.get(`/common/msg/msgDetail/${id}?agent=${apiAgent}`)
}