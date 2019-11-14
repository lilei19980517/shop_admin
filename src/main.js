import Vue from 'vue'
import App from './App'
import router from './router'
import '@/assets/index.css'
// 导入elementui-js
import ElementUI from 'element-ui'
// 导入elementui-css
import 'element-ui/lib/theme-chalk/index.css'
// 安装插件
Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
