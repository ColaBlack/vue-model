import axios from 'axios'

export const BASE_URL = 'http://localhost:1221'

const request = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  withCredentials: true
})

// 请求拦截器
request.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    const { data } = response
    // 未登录
    if (data.code === 40100) {
      // 不是获取用户信息接口，并且不是登录页面，则跳转到登录页面并保存当前页面的路径
      if (
        !response.request.responseURL.includes('user/get/login') &&
        !window.location.pathname.includes('/user/login')
      ) {
        window.location.href = `/user/login?redirect=${window.location.href}`
      }
    }
    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)

export default request
