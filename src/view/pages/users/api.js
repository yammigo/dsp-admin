import axios from '@/libs/api.request'
import md5 from 'js-md5'
/***
 * 用户信息接口
 */
// 接口1： 获取列表
export const getUserList = (parmas) => {
  return axios.request({
    url: '/user/info/list.do',
    method: 'post',
    data: { ...parmas }
  })
}

// 接口2： 创建用户
export const addUser = (parmas) => {
  return axios.request({
    url: '/user/info/add.do',
    method: 'post',
    data: { ...parmas }
  })
}
// 修改用户信息
export const updataUser = (parmas) => {
  return axios.request({
    url: '/user/info/update.do',
    method: 'post',
    data: { ...parmas }
  })
}
// 启用、禁用
export const updataStatus = ({ userId, status }) => {
  return axios.request({
    url: '/user/info/update/status.do',
    method: 'post',
    data: { userId, status }
  })
}
// 重置密码
export const resetPwd = ({ userId, pwd }) => {
  return axios.request({
    url: '/user/info/update/pwd.do',
    method: 'post',
    data: { userId, pwd: md5(pwd) }
  })
}
// 查看用户【投放资质】
export const getuserPut = ({ userId }) => {
  return axios.request({
    url: '/user/info/qa/ad/put.do',
    method: 'post',
    data: { userId }
  })
}
// 审核用户【投放资质】//修改
export const updatePut = (parmas) => {
  return axios.request({
    url: '/user/info/qa/ad/put/status.do',
    method: 'post',
    data: { ...parmas }
  })
}
// 查看用户【企业认证】
export const quaCompany = (parmas) => {
  return axios.request({
    url: '/user/info/qa/company.do',
    method: 'post',
    data: { ...parmas }
  })
}
// 修改用户【企业认证】/审核
export const updateQuaCompany = (parmas) => {
  return axios.request({
    url: '/user/info/qa/company/status.do',
    method: 'post',
    data: { ...parmas }
  })
}
/**
 * 充值界面接口
 */
// 接口1： 列表
export const getRecharge = (parmas) => {
  return axios.request({
    url: '/user/recharge/list.do',
    method: 'post',
    data: { ...parmas }
  })
}
export const addRecharge = (parmas) => {
  return axios.request({
    url: '/user/recharge/add.do',
    method: 'post',
    data: { ...parmas }
  })
}
export const updateStatus = (parmas) => {
  return axios.request({
    url: '/user/recharge/update/status.do',
    method: 'post',
    data: { ...parmas }
  })
}
