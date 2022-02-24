const log4js = require('./log4')
const jwt = require('jsonwebtoken')
const CODE = {
  SUCCESS: 200,
  PARAM_ERROR: 10001,//参数错误
  USER_ACCOUNT_ERROR: 20001,//账号或者密码错误
  USER_LOGIN_ERROR: 30001,//用户未登录
  BUSINESS_ERROR: 40001,//业务请求失败
  AUTH_ERROR: 50001,//认证失败||token过期
}

module.exports = {
  //分页的封装  
  pager ({pageNum = 1, pageSize = 10}) {
    // 字符串转数值
    pageNum *= 1//页数
    pageSize *= 1//一页的条数
    const skipIndex = (pageNum - 1) * pageSize//下一页第一条的索引
    return {
      page: {
        pageNum,
        pageSize
      },
      skipIndex
    }
  },
  success (data = '', msg = '', code = CODE.SUCCESS) {
    log4js.debug(data)
    return {
      code,
      data,
      msg
    }
  },
  fail (msg = '', code = CODE.BUSINESS_ERROR, data) {
    log4js.debug(msg)//错误信息
    return {
      code,
      data,
      msg
    }
  },
  decode(authorization){
    if(authorization){
      let token = authorization.split(" ")[1];
      return jwt.verify(token,'llr')
    }
    return ''
  },

  // 递归树
  getTree(rootList, id, list) {
    for (let i = 0; i < rootList.length; i++) {
      let item = rootList[i];
      if (String(item.parentId.slice().pop()) == String(id)) {
        list.push(item._doc);
      }
    }
    list.map((item) => {
      item.children = [];
      this.getTree(rootList, item._id, item.children);
      if (item.children.length == 0) {
        delete item.children;
      } else if (item.children.length > 0 && item.children[0].menuType == 2) {
          // //区分按钮和菜单 按钮权限
        item.action = item.children; 
      }
    });
    return list;
  }

}