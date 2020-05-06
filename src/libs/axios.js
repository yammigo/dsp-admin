import axios from 'axios'
import store from '@/store'
import Cookies from 'js-cookie'
import Vue from 'vue'
const vm = new Vue()

// import { Message } from 'iview'
const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      let params = {
        body: config.data || {},
        header: {
          token: Cookies.get('token') || ''
        }
      }
      config.data = JSON.stringify(params)

      return config
    }, error => {
      vm.$Message.error('请求发送失败')
      return Promise.reject(error)
    })

    // 响应拦截
    instance.interceptors.response.use(res => {
      if (res.data.code == '-2') {
        // 登录失效
        Utils.clearCookie()
        Utils.removeLocal('tagNaveList')
        Utils.removeLocal('menuData')
        vm.$Message.error(res.data.msg)
        window.location.reload()
      }
      if (res.data.code == -1) {
        vm.$Message.error(res.data.msg)
      }
      this.destroy(url)
      // console.log(res);
      res.data.ok = res.data.code == 0
      const { data, status } = res
      return { data, status }
    }, error => {
      this.destroy(url)
      let errorInfo = error.response
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      addErrorLog(errorInfo)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
