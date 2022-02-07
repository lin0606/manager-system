import storage from '../utils/storage'
// 导出对象
export default {
  // 用户信息
  saveUserInfo (state, userInfo) {
    state.userInfo = userInfo
    storage.setItem('userInfo', userInfo)
  }
}