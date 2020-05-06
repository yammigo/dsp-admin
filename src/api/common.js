import axios from '@/libs/api.request'

// 获取行业列表
export const getCategory = (params) => {
  return axios.request({
    url: '/base/category/list.do',
    method: 'post',
    data: { ...params }
  })
}
// 获取城市列表
export const getCityList = (params) => {
  return axios.request({
    url: '/base/city/list.do',
    method: 'post',
    data: { ...params }
  })
}
// 获取公司主体
export const getCompany = (params) => {
  return axios.request({
    url: '/base/company/list.do',
    method: 'post',
    data: { ...params }
  })
}
// 获取所有公司主体
export const getCompanyAll = () => {
  return axios.request({
    url: '/base/company/list.do',
    method: 'post',
    data: { page: 1, limit: 10000, data: {} }
  })
}
// 获取广告位类型
export const getAdtype = (params) => {
  return axios.request({
    url: '/base/ad/type/list.do',
    method: 'post',
    data: { ...params }
  })
}
// 获取所有的用户
export const getUserAll = (parmas) => {
  return axios.request({
    url: '/user/info/list.do',
    method: 'post',
    data: { page: 1, limit: 10000, data: {} }
  })
}
// 获取所有的广告组
export const getGroupAll = (parmas) => {
  return axios.request({
    url: '/user/ad/group/list.do',
    method: 'post',
    data: { page: 1, limit: 10000, data: {} }
  })
}
// 获取所有的广告计划
export const getPlanAll = (parmas) => {
  return axios.request({
    url: '/user/ad/plan/list.do',
    method: 'post',
    data: { page: 1, limit: 10000, data: {} }
  })
}
// 获取所有的广告创意
export const getIdeaAll = (parmas) => {
  return axios.request({
    url: '/user/ad/idea/list.do',
    method: 'post',
    data: { page: 1, limit: 10000, data: {} }
  })
}

// 获取所有的渠道广告位
export const getCodeAll = () => {
  return axios.request({
    url: '/channel/slot/list.do',
    method: 'post',
    data: { page: 1, limit: 10000, data: {} }
  })
}

// 获取所有的应用
export const getAppAll = () => {
  return axios.request({
    url: '/channel/app/list.do',
    method: 'post',
    data: { page: 1, limit: 10000, data: {} }
  })
}
