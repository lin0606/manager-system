// 用户角色模块
const router = require("koa-router")();
const util = require("../utils/util");
const Role = require("../models/roleSchema");
const jwt = require("jsonwebtoken");
const md5 = require("md5");
router.prefix("/roles");
// 用户列表
router.get("/allList", async (ctx) => {
  try {
    const list = await Role.find({}, "_id roleName");
    ctx.body = util.success(list);
  } catch (error) {
    ctx.body = util.fail(`查询失败${error.stack}`);
  }
});

router.get("/list", async (ctx) => {
  const { roleName } = ctx.request.query;
  const { page, skipIndex } = util.pager(ctx.request.query);
  try {
    let parmas = {};
    if (roleName) parmas.roleName = roleName;
    const query = Role.find(parmas);
    const list = await query.skip(skipIndex).limit(page.pageSize);
    const total = await Role.countDocuments(parmas);
    ctx.body = util.success({
      list,
      page: {
        ...page,
        total,
      },
    });
  } catch (error) {
    ctx.body = util.fail(`查询失败${error.stack}`);
  }
});

//操作 创建和删除
router.post("/operate", async (ctx) => {
  const { _id, roleName, remark, action } = ctx.request.body;
  let res, info;
  try {
    if (action == "create") {
      res = await Role.create({ roleName, remark });
      info = "创建成功";
    } else if (action == "edit") {
      if (_id) {
        let params = { roleName, remark };
        params.update = new Date();
        res = await Role.findByIdAndUpdate(_id, params);
      } else {
        ctx.body = util.fail(`缺少参数params:_id`);
        return;
      }
    } else {
      if (_id) {
        res = await Role.findByIdAndDelete(_id);
        info = "删除成功";
      } else {
        ctx.body = util.fail(`删除失败`);
      }
    }
    ctx.body = util.success(res, info);
  } catch (error) {
    ctx.body = util.fail(`操作失败${error.stack}`);
  }
});

// 设置权限
router.post("/update/permission", async (ctx) => {
  const { _id, permissionList } = ctx.request.body;
  try {
    let params = { permissionList, updateTime: new Date() };
    let res = await Role.findByIdAndUpdate(_id, params);
    ctx.body = util.success(res, "权限设置成功");
  } catch (error) {
    ctx.body = util.fail("权限设置失败");
  }
});

module.exports = router;
