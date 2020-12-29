/*
基于axios封装的请求模块
*/

import axios from 'axios'

//创建请求对象
export const request = axios.create({
  baseURL: 'https://conduit.productionready.io/'
})

//通过插件机制获取到上下文对象(query, params, req, res, app, store)
//插件导出函数必须是default成员
export default ({ store, redirect }) => {
  //请求拦截器
  //任何请求都会经过请求拦截器
  //我们可以在请求拦截器中做一些公共的业务处理，例如统一设置token
  request.interceptors.request.use(function (config) {
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Token ${user.token}`
    }

    //返回config请求配置对象
    return config
  }, function (error) {
    //如果请求失败（此时请求还没有发出去），就会进这里
    return Promise.reject(error)
  })

  // response interceptor
  request.interceptors.response.use(
    res => {
      return res
    },
    error => {
      console.log(error.response)
      const { data } = error.response
      switch (data.status) {
        case "401":
          redirect('/login')
          break;
        case "404":
          redirect('/404')
          break;
        default:

          break;
      }

      return Promise.reject(error)
    })


}