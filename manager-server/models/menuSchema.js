const mongoose = require('mongoose')
const menuSchema = mongoose.Schema({
  menuType: Number,
  menuName: String,
  menuCode: String,
  path: String,
  icon: String,
  component: String,
  menuState: Number,
  parentId: [mongoose.Types.ObjectId],
  //创建时间
  "createTime": {
    type: Date,
    default: Date.now()
  },
  //更新时间
  "updateTime": {
    type: Date,
    default: Date.now()
  },
})
module.exports = mongoose.model('menu', menuSchema, 'menus')