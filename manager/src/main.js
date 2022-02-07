import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import App from './App.vue'
import axios from 'axios'
import config from './config'
import request from './utils/request'
import storage from './utils/storage'
import api from './api'
import store from './store'
// axios.get(config.mockApi + '/login').then((res) => {
//   console.log(res);
// })
const app = createApp(App)
app.config.globalProperties.$request = request
app.config.globalProperties.$storage = storage
app.config.globalProperties.$api = api
app.use(router).use(ElementPlus,{size:'small'}).use(store).mount('#app')

// development
console.log("环境变量", import.meta.env);


