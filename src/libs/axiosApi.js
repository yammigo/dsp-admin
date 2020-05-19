
import axios from 'axios'
import Vue from 'vue'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

const vm = new Vue()
function typeOf (obj) {
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[toString.call(obj)]
}
function deepString (data) {
  const t = typeOf(data)
  let o

  if (t === 'array') {
    o = []
  } else if (t === 'object') {
    o = {}
  } else {
    return data
  }

  if (t === 'array') {
    for (let i = 0; i < data.length; i++) {
      o.push(deepString(data[i]))
    }
  } else if (t === 'object') {
    for (let i in data) {
      if (typeOf(data[i]) == 'number') {
        if (i == 'total') {

        } else {
          data[i] += ''
        }
      }
      o[i] = deepString(data[i])
    }
  }
  return o
}
// ajax请求处理
axios.interceptors.request.use(function (config) {
  // config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  // 导出文件
  if (config.url.indexOf('export/private') > -1 || config.url.indexOf('/export') > -1) {
    config.responseType = 'blob'
  }
  let token = Utils.getCookie('token')
  let params = {
    body: config.data,
    header: {
      token: token
    }
  }
  config.url = baseUrl + config.url
  config.data = JSON.stringify(params)

  vm.$Loading.start() // 加载开始

  return config
})
axios.interceptors.response.use(response => {
  console.log(response, 'adadad')
  if (response.config.responseType === 'blob') {
    let fileName = response.headers.filename
    let link = document.createElement('a')
    let blob = new Blob([response.data], { type: 'application/vnd.ms-excel' })
    link.style.display = 'none'
    let url = URL.createObjectURL(blob)
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    vm.$Loading.finish() // 加载结束
    if (response.data.code == -2) {
      Utils.clearCookie()
      Utils.removeLocal('tagNaveList')
      Utils.removeLocal('menuData')
      vm.$Message.error(response.data.msg)
      window.location.reload()
      // location.reload()
    } else if (response.data.code != 0) {
      vm.$Message.error(response.data.msg)
    }

    // if(response.config.url.indexOf('/role/getRoleMenuIdSets.do')||response.config.url.indexOf('/menu/getAllMenu.do')){
    //   return  response.data
    // }else{
    //     return deepString(response.data);
    // }
    return response.data
    // console.log(response.data,"拦截器数据");
    // return response.data;
    // return deepString(response.data);
  }
}, error => {
  // 请求错误时做些事
  vm.$Loading.error() // 加载失败
  return Promise.reject(error)
})

export default axios
