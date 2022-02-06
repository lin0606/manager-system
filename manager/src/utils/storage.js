// localstorage的二次封装

import config from './../config'

export default {
  getStorage () {
    // 返回一个对象
    return JSON.parse(window.localStorage.getItem(config.namespace) || "{}")
  },
  setItem (key, val) {
    let storage = this.getStorage()
    storage[key] = val
    // 避免项目过大，有命名冲突的问题
    window.localStorage.setItem(config.namespace, JSON.stringify(storage))
  },
  getItem (key) {
    return this.getStorage()[key]
  },
  clearItem (key) {
    let storage = this.getStorage()
    delete storage[key]
    window.localStorage.setItem(config.namespace, JSON.stringify(storage))
  },
  clearAll () {
    window.localStorage.clear()
  }
}