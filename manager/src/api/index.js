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
  // 待审批通知数量
  noticeCount() {
    return request({
      url: '/leave/count',
      method: 'get',
      mock: true,
      data: {}
    })
  },
  // 菜单列表
  menuList() {
    return request({
      url: '/menu/list',
      method: 'get',
      mock: true,
      data: {}
    })
  },
  // 用户列表
  userList(params){
    return request({
      url:'/users/list',
      method:'get',
      mock:true,
      data:params
    })
  },
  //用户单个删除 
  userDelete(params){
    return request({
      url:'/users/delete',
      method:'post',
      mock:true,
      data:params
    })
  },
  
  // 角色名称列表
  getRoleList(){
    return request({
      url:'/roles/allList',
      method:'get',
      mock:true,
    })
  },
  // 部门列表
  getDeptList(){
    return request({
      url:'/dept/list',
      method:'get',
      mock:true,
    })
  },
  // user新增提交接口
  userSubmit(params) {
    return request({
      url:'/users/operate',
      method:'post',
      mock:true,
      data:params
    })
  }
}