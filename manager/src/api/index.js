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
  // 根据用户权限显示菜单
  PermissionList(){
    return request({
      url: '/users/getPermissionList',
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
  userAllList(){
    return request({
      url:'/users/all/list',
      method:'get',
      mock:true,
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
  getDeptList(params){
    return request({
      url:'/dept/list',
      method:'get',
      mock:true,
      data:params
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
  },
  // 菜单提交
  menuSubmit(params){
    return request({
      url:'/menu/operate',
      method:'post',
      mock:true,
      data:params
    })
  },
  // 角色列表
  roleList(){
    return request({
      url:'/roles.list',
      method:'get',
      mock:true,
    })
  },
  // 角色新增提交接口
  roleOperate(params){
    return request({
      url:'/role/operate',
      method:'post',
      mock:true,
      data:params
    })
  },
  // 权限设置提交
  updatePermission(params){
    return request({
      url:'/roles/update/permission',
      method:'post',
      mock:true,
      data:params
    })
  },
  // 部门操作
  deptOperate(params){
    return request({
      url:'/dept/operate',
      method:'post',
      mock:true,
      data:params
    })
  }

}