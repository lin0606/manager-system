import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8081,
    proxy: {
      // http://localhost:8081/api 指向 http://localhost:3000/api
      "/api": {
        target: 'http://localhost:3000',
        changeOrigin: true,//跨域处理
        // 可以让指向后台的URL中api变为空
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
