import axios from '@/libs/api.request'
/***
 * 广告组
 */
// 接口1： 获取列表
export const adGroupApi = {

  getAdGroup: (parmas) => {
    return axios.request({
      url: '/user/ad/group/list.do',
      method: 'post',
      data: { ...parmas }
    })
  },
  addGroup: (parmas) => {
    return axios.request({
      url: '/user/ad/group/add.do',
      method: 'post',
      data: { ...parmas }
    })
  },
  updateGroup: (parmas) => {
    return axios.request({
      url: '/user/ad/group/update.do',
      method: 'post',
      data: { ...parmas }
    })
  },
  updateGroupStatus: (parmas) => {
    return axios.request({
      url: '/user/ad/group/update/status.do',
      method: 'post',
      data: { ...parmas }
    })
  }
}

/**
 * 计划接口
 */
export const adPlanApi = {
  getAdPlan (parmas) {
    return axios.request({
      url: '/user/ad/plan/list.do',
      method: 'post',
      data: { ...parmas }
    })
  },
  addPlan (parmas) {
    return axios.request({
      url: '/user/ad/plan/add.do',
      method: 'post',
      data: { ...parmas }
    })
  },
  updatePlan (parmas) {
    return axios.request({
      url: '/user/ad/plan/update.do',
      method: 'post',
      data: { ...parmas }
    })
  },
  updateStatus (parmas) {
    return axios.request({
      url: '/user/ad/plan/update/status.do',
      method: 'post',
      data: { ...parmas }
    })
  }
}

/**
 * 创意接口
 */
export const ideaApi = {
  // 列表
  getIdea (parmas) {
    return axios.request({
      url: '/user/ad/idea/list.do',
      method: 'post',
      data: { ...parmas }
    })
  },
  // 添加
  addIdea (parmas) {
    return axios.request({
      url: '/user/ad/idea/add.do',
      method: 'post',
      data: { ...parmas }
    })
  },
  // 修改
  updateIdea (parmas) {
    return axios.request({
      url: '/user/ad/idea/update.do',
      method: 'post',
      data: { ...parmas }
    })
  },
  // 修改状态
  updateStatus (parmas) {
    return axios.request({
      url: '/user/ad/idea/update/status.do',
      method: 'post',
      data: { ...parmas }
    })
  }
}

// 素材库
export const libraryApi = {
  getLibrary (parmas) {
    return axios.request({
      url: '/user/ad/library/list.do',
      method: 'post',
      data: { ...parmas }
    })
  },
  deleteLibrary (parmas) {
    return axios.request({
      url: '/user/ad/library/delete.do',
      method: 'post',
      data: { ...parmas }
    })
  }
}
