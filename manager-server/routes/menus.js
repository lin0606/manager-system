const router = require("koa-router")();
const util = require("../utils/util");
const Menu = require("../models/menuSchema");
router.prefix("/menu");

// 菜单列表查询
router.get("/list", async (ctx) => {
  const { menuName, menuState } = ctx.request.query;
  const params = {};
  if (menuState) params.menuState = menuState;
  if (menuName) params.menuName = menuName;
  const  rootList = (await Menu.find(params)) || [];
  const permissionList = getMenuTree(rootList, null, []);
  ctx.body = util.success(permissionList);
});

function getMenuTree(rootList, id, list) {
  for (let i = 0; i < rootList.length; i++) {
    let item = rootList[i];
    if (String(item.parentId.slice().pop()) == String(id)) {
      list.push(item._doc);
    }
  }
  list.map((item) => {
    item.children = [];
    getMenuTree(rootList, item._id, item.children);
    if (item.children.length == 0) {
      delete item.children;
    } else if (item.children.length > 0 && item.children[0].menuType == 2) {
        // //区分按钮和菜单 按钮权限
      item.action = item.children; 
    }
  });
  return list;
}

router.post("/operate", async (ctx) => {
  const { _id, action, ...params } = ctx.request.body;
  let res, info;

  try {
    if (action == "add") {
      res = await Menu.create(params);
      info = "创建成功";
    } else if (action == "edit") {
      params.updateTime = new Date();
      await Menu.findByIdAndUpdate(_id, params);
      info = "编辑成功";
    } else {
      await Menu.findByIdAndRemove(_id);
      await Menu.deleteMany({ parentId: { $all: [_id] } });
      info = "删除成功";
    }
    ctx.body = util.success({}, info);
  } catch (error) {}
});

module.exports = router;


// [
//   {
//     _id: new ObjectId("61a8b9b2ed448cfa1c2cb001"),
//     menuType: 1,
//     menuName: '系统管理',
//     path: '/system',`
//     __v: 0,
//      parentId: [ null ],
//   },
//   {
//     _id: new ObjectId("61a8b9caed448cfa1c2cb004"),
//     menuType: 1,
//     menuName: '用户管理',
//     path: '/system/user',
//     icon: '',
//     component: '/system/user',
//     menuState: 1,
//     parentId: [ new ObjectId("61a8b9b2ed448cfa1c2cb001") ],
//     __v: 0
//   }
// ]