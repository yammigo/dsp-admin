import axios from '@/libs/api.request'
/***
 * APP
 */
// 接口1： 广告主日报
export const reportApi = {
  // 广告主日报
  adVertiser (parmas) {
    return axios.request({
      url: '/data/list/income/user.do',
      method: 'post',
      data: { ...parmas }
    })
  },
  // 渠道日报
  adChannel (parmas) {
    return axios.request({
      url: '/data/list/income/channel.do',
      method: 'post',
      data: { ...parmas }
    })
  },
  // 实时数据
  hourData (parmas) {
    return axios.request({
      url: '/data/list/hour.do',
      method: 'post',
      data: { ...parmas }
    })
  }

}
