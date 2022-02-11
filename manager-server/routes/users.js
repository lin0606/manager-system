const router = require("koa-router")();
const User = require("../models/userSchema");
const Counter = require("../models/counterSchema");
const utils = require("../utils/utils");
const jwt = require("jsonwebtoken");
const util = require("../utils/utils");
const md5 = require("md5");
router.prefix("/users");

//users的后端接口
router.post("./login", async (ctx) => {
  try {
    const { userName, userPwd } = ctx.request.body;
    // 返回数据的指定内容方法：
    // 1、findone({},'指定的返回属性')
    // 2、{userId：1, _id:0}  要返回的value为1，不返回的为0
    // 3、findOne({}).select('要查找的属性名')
    const res = await User.findOne(
      {
        userName,
        userPwd: md5(userPwd)
      },
      "userId userName userEmail state role dept"
    );

    if (res) {
      const data = res._doc; //返回的真实数据
      const token = jwt.sign(
        {
          data: data,
        },
        "llr",
        { expiresIn: "1h" }
      );
      data.token = token;
      ctx.body = utils.success(data);
    } else {
      ctx.body = utils.fail("用户名或密码不准确");
    }
  } catch (error) {
    ctx.body = utils.fail(error.msg);
  }
});
// 获取用户列表
router.get("/list", async (ctx) => {
  const { userId, userName, state } = ctx.request.query;
  const { page, skipIndex } = utils.pager(ctx.request.query);

  let params = {};
  if (userId) params.userId = userId;
  if (userName) params.userName = userName;
  if (state && state != "0") params.state = state;

  try {
    const query = User.find(params, { _id: 0, userPwd: 0 });
    const list = await query.skip(skipIndex).limit(page.pageSize); //分页
    const total = await User.countDocuments(params);

    ctx.body = util.success({
      page: {
        ...page,
        total,
      },
      list,
    });
  } catch (error) {
    ctx.body = util.fail(`查询异常${error.stack}`);
  }
});
// 删除用户，状态变为离职
router.post("/delete", async (ctx) => {
  const { userIds } = ctx.request.body;
  const res = await User.updateMany({ userId: { $in: userIds } }, { state: 2 });
  if (res.modifiedCount) {
    ctx.body = util.success(res, `共删除成功${res.modifiedCount} 条`);
    return;
  } else {
    ctx.body = util.fail("删除失败");
  }
});

router.post("/operate", async (ctx) => {
  const {
    userId,
    userName,
    userEmail,
    mobile,
    job,
    state,
    roleList,
    deptId,
    action,
  } = ctx.request.body;

  if (action == "add") {
    if (!userName || !userEmail || !deptId) {
      ctx.body = util.fail("参数错误", util.CODE.PARAM_ERROR);
      return;
      // 新增用户
      const res = await User.findOne(
        { $or: [{ userName }, { userEmail }] },
        "_id userName userEmail"
      );
      if (res) {
        ctx.body = util.fail(
          `监测到有重复的用户,信息为：${res.userName} - ${res.userEmail}`
        );
      } else {
        try {
          const doc = await Counter.findOneAndUpdate(
            { _id: "userId" },
            { $inc: { sequence_value: 1 } }
          );
          const user = new User({
            userId: doc.sequence_value,
            userName,
            userPwd: md5("123456"),
            userEmail,
            role: 1,
            roleList,
            state,
            job,
            deptId,
            mobile,
          });
          user.save();
          ctx.body = util.success({}, "用户创建成功");
        } catch (error) {
          ctx.fail(error.stack, "用户创建失败");
        }
      }
    } else {
      if (!deptId) {
        ctx.body = util.fail("部门不能为空", util.CODE.PARAM_ERROR);
        return;
      }
      try {
        const res = await User.findOneAndUpdate(
          { userId },
          { mobile, job, state, roleList, deptId }
        );
        ctx.body = util.success(res, "更新成功");
        return;
      } catch (error) {
        ctx.body = util.fail("更新失败");
      }
    }
    
  }
});

module.exports = router;
