import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login'
import Home from '@/components/home/Home'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/home', component: Home },
    { path: '/login', component: Login },
  ]
})
router.beforeEach((to,from,next) => {
 if(to.path === '/login'){
   next()
 }else{
   let token = localStorage.getItem('token')
   if(token){
     next()
   }else next('/login')
 }
})
export default router