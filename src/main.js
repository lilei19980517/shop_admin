import Vue from 'vue'
import App from './App'
import router from './router'
import '@/assets/index.css'
import axios from 'axios'
// 导入elementui-js
import ElementUI from 'element-ui'
// 导入elementui-css
import 'element-ui/lib/theme-chalk/index.css'

Vue.prototype.$http = axios
// 配置公共路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'
// 请求拦截器
axios.interceptors.request.use(
  function (config) {
    if(!config.url.endsWith('/login')){
      config.headers['Authorization'] = localStorage.getItem('token')
    }
    console.log("请求拦截器",config)
    return config
  }
)
// 响应拦截器
axios.interceptors.response.use(
  function(response){
    console.log("响应拦截器",response)
    return response
  }
)
// 安装插件
Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
