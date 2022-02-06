import request from "../utils/request"
export default {
  login(params) {
    return request({
      url: '/users/login',
      method: 'post',
      data: params,
      // mock: true
    })
  },
  noticeCount() {
    return request({
      url: '/leave/count',
      method: 'get',
      mock: true,
      data: {}
    })
  },
}