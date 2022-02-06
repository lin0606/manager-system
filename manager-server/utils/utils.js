const log4js = require('./log4')
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
  pager (pageNum = 1, pageSize = 10) {
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
  }
}