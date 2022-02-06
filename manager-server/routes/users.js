const router = require('koa-router')()
const User = require('../models/userSchema')
const utils = require('../utils/utils')
router.prefix('/users')

//users的后端接口
router.post('./login', async (ctx) => {
  try {
    const {
      userName,
      userPwd
    } = ctx.request.body;
    const res = await User.findOne({
      userName,
      userPwd
    })
    if (res) {
      ctx.body = utils.success(res)
    } else {
      ctx.body = utils.fail('用户名或密码不准确')
    }
  }catch(error){
    ctx.body = utils.fail(error.msg)
  }
})

module.exports = router