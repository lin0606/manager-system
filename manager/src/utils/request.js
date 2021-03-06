import axios from 'axios'
import config from '../config'
import { ElMessage } from 'element-plus'
import router from '../router'
import storage from './storage'
const TOKEN_ERROR = 'Token认证失败,请重新登录'
const NETWORK_ERROR = '网路请求异常,请稍后重试'
// 创建axios实例对象 添加全局配置
const service = axios.create({
  baseURL: config.baseApi,
  timeout: 8000
})

// 请求的拦截
service.interceptors.request.use((req) => {
  // jwt的token的验证的header
  const headers = req.headers
  const {token=''} = storage.getItem('userInfo')||{}
  if (!headers.Authorization) headers.Authorization = 'Bearer '+ token
  
  return req
})

// 响应拦截
service.interceptors.response.use((res) => {
  // 后台返回数据的格式
  const { code, data, msg } = res.data
  // res.data.data
  // this.$axios.get('').then((res)=>{
  //   console.log(res);
  //   const {data} = res.data
  // })
  if (code === 200) {
    return data
  } else if (code === 50001) {
    ElMessage.error(TOKEN_ERROR)
    setTimeout(() => {
      router.push('/login')
    }, 1500)
    return Promise.reject(TOKEN_ERROR)
  } else {
    ElMessage.error(msg || NETWORK_ERROR)
    return Promise.reject(msg || NETWORK_ERROR)
  }
})

// 请求的核心函数
function request (options) {
  options.method = options.method || 'get'
  // toLowerCase将字符串中的大写字母转小写
  if (options.method.toLowerCase() === 'get') {
    // 后面组件中在调用接口的时候 传过来的都在对象的data属性中 
    options.params = options.data
  }

  // config全局中的mock一直为true
  let isMock = config.mock
  if (typeof options.mock !== 'undefined') {
    isMock = options.mock
  }
  // 注意！！p0级bug
  if (config.env === 'prod') {
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
  }
  return service(options)
}

['get', 'post', 'put', 'delete', 'patch'].forEach((item) => {
  request[item] = (url, data, options) => {
    return request({ 
      url,
      data,
      method: item,
      ...options
    })
  }
})

// this.$request.get("/login",{name:'llr'},{mock:true}).then(res=>{console.log(res)})

export default request