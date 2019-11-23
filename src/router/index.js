import Vue from 'vue'
import Router from 'vue-router'
// 登录
import Login from '@/components/login/Login'
// 后台管理主界面
import Home from '@/components/home/Home'
// 用户组件
import Users from '@/components/users/Users'
// 权限组件
import Rights from '@/components/rights/Rights'
// 角色管理组件
import Roles from '@/components/roles/Roles'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    {
      path: '/home',
      component: Home,
      children: [
        { path: 'users', component: Users },
        { path: 'rights', component: Rights },
        { path: 'roles', component: Roles }
      ]
    },
    { path: '/login', component: Login },
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    let token = localStorage.getItem('token')
    if (token) {
      next()
    } else next('/login')
  }
  next()
})
export default router