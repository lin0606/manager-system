const router = require('koa-router')()
const User = require('../models/userSchema')
const utils = require('../utils/utils')
const jwt = require('jsonwebtoken')
router.prefix('/users')

//users的后端接口
router.post('./login', async (ctx) => {
  try {
    const {
      userName,
      userPwd
    } = ctx.request.body;
    // 返回数据的指定内容方法：
    // 1、findone({},'指定的返回属性')
    // 2、{userId：1, _id:0}  要返回的value为1，不返回的为0
    // 3、findOne({}).select('要查找的属性名')
    const res = await User.findOne({
      userName,
      userPwd
    },'userId userName userEmail state role dept')
    const data = res._doc //返回的真实数据
    const token = jwt.sign({
      data:data
    },'llr',{expiresIn:'1h'})
    if (res) {
      data.token = token
      ctx.body = utils.success(data)
    } else {
      ctx.body = utils.fail('用户名或密码不准确')
    }
  }catch(error){
    ctx.body = utils.fail(error.msg)
  }
})

module.exports = router