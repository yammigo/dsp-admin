import axios from '@/libs/api.request'
/***
 * APP
 */
// 接口1： 获取列表
export const appApi = {

  getApp: (parmas) => {
    return axios.request({
      url: '/channel/app/list.do',
      method: 'post',
      data: { ...parmas }
    })
  },
  addApp: (parmas) => {
    return axios.request({
      url: '/channel/app/add.do',
      method: 'post',
      data: { ...parmas, channelId: 1 }
    })
  },
  updateApp: (parmas) => {
    return axios.request({
      url: '/channel/app/update.do',
      method: 'post',
      data: { ...parmas, channelId: 1 }
    })
  },
  updateAppStatus: (parmas) => {
    return axios.request({
      url: '/channel/app/update/status.do',
      method: 'post',
      data: { ...parmas }
    })
  }
}

export const slotApi = {

  getSlot: (parmas) => {
    return axios.request({
      url: '/channel/slot/list.do',
      method: 'post',
      data: { ...parmas }
    })
  },
  addSlot: (parmas) => {
    return axios.request({
      url: '/channel/slot/add.do',
      method: 'post',
      data: { ...parmas }
    })
  },
  updateSlot: (parmas) => {
    return axios.request({
      url: '/channel/slot/update.do',
      method: 'post',
      data: { ...parmas }
    })
  },
  updateSlotStatus: (parmas) => {
    return axios.request({
      url: '/channel/slot/update/status.do',
      method: 'post',
      data: { ...parmas }
    })
  }
}

// 策略列表
export const ruleApi = {

  getRule: (parmas) => {
    return axios.request({
      url: '/channel/rule/list.do',
      method: 'post',
      data: { ...parmas }
    })
  },
  addRule: (parmas) => {
    return axios.request({
      url: '/channel/rule/add.do',
      method: 'post',
      data: { ...parmas }
    })
  },
  updateRule: (parmas) => {
    return axios.request({
      url: '/channel/rule/update.do',
      method: 'post',
      data: { ...parmas }
    })
  },
  updateRuleStatus: (parmas) => {
    return axios.request({
      url: '/channel/rule/update/status.do',
      method: 'post',
      data: { ...parmas }
    })
  }
}
