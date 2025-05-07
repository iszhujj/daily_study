import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import minimist from 'minimist'

// 解析命令行参数
// const argv = minimist(process.argv.slice(2));
// const openPage = argv['open-page'] || 'index.html'; // 默认打开首页
// console.log('openPage', openPage);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    open: '/custom-directive', // 自动打开页面
    host: '0.0.0.0', // 允许外部访问
    port: 5173, // 端口号
  }
})
