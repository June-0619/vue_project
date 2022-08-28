import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path:'/home', component: Home,
  redirect:'/welcome',
  children:[
    {path:'/welcome',component: Welcome},
    {path:'/users',component: Users},/* 这个是菜单项默认对应的路径，不能自己命名 */
    {path:'/rights',component: Rights},
    {path:'/roles',component:Roles}
  ]
  }
]

const router = new VueRouter({
  routes
})
//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  //to代表将要访问的路径，from代表从哪个路径跳转而来，next为一个函数表示放行
	//如果用户访问的是登录页，直接放行
  if(to.path==='/login')return next();
  //从sessionStorage中获取token
	const tokenStr=window.sessionStorage.getItem('token');
	//没有token,强制跳转到登录页
  if(!tokenStr) return next('/login');
	//token存在，直接放行
  next();
})

export default router
