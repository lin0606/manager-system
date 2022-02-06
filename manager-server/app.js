const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
// const logger = require('koa-logger')
// var log4js = require("log4js");

const log4js = require('./utils/log4')
// const index = require('./routes/index')
const users = require('./routes/users')
const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const koajwt =  require('koa-jwt')

// error handler
onerror(app)
require('./config/db')

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
// app.use(logger())
// const logger = log4js.getLogger();
// logger.level = "info";
// logger.info("Some debug messages");
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))
app.use(()=>{
  ctx.body('error-body');
})


// logger
app.use(async (ctx, next) => {
  // const start = new Date()
  log4js.info(`get params:${JSON.stringify(ctx.request.query)}`)
  log4js.info(`post params:${JSON.stringify(ctx.request.body)}`)
  await next().catch((error)=>{
    if(error.status == '401'){
      ctx.status = 200
      ctx.body = util.fail('Token认证失败',util.CODE.AUTH_ERROR)
    }else{
      throw error
    }
  }) 
  
  // const ms = new Date() - start
  // console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
app.use(koajwt({
  secret: 'llr'
}).unless(
  {path: [/^\/api\/users\/login/]
}))
router.prefix('/api')
router.get('/leave/count',(ctx)=>{
  const token = ctx.request.header.authorization.split(' ')[1]
  const payload = jwt.verify(token,'llr')
  ctx.body = payload
  
  // 拿到token
})
router.use(users.routes(),users.allowedMethods())
// routes
// app.use(index.routes(), index.allowedMethods())
app.use(router.routes(), router.allowedMethods())

log4js.info("info output")


// error-handling
app.on('error', (err, ctx) => {
  // console.error('server error', err, ctx)
  log4js.error(`${err.stack}`,ctx)
});

module.exports = app
