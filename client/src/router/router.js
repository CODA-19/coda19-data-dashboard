import VueRouter from 'vue-router'
import Home from '@/views/Home'
import AppHeader from '@/components/AppHeader'
import Footer from '@/components/Footer'
import About from '@/views/About'
import SelectData from '@/views/SelectData'
import Dashboard from "@/views/Dashboard"


  const routes = [
  {
    path: '/',
    name: 'Home',
    components: {
      header:AppHeader,
      default: Home,
      footer: Footer
    },
    meta: {
      title: "CODA 19"
    }
  },
  {
    path: '/about',
    name: 'About',
    components: {
      header:AppHeader,
      default: About,
      footer: Footer
    },
    meta: {
      title: "CODA 19 - About"
    }
  },
      {
    path: '/selectData',
    name: 'SelectData',
      components: {
        header:AppHeader,
        default: SelectData,
        footer: Footer
      },
    meta: {
      title: "CODA 19 - Data selection"
    }
  },
    {
      path: '/dashboard',
      name: 'Dashboard',
      components: {
        header:AppHeader,
        default: Dashboard,
        footer: Footer
      },
      meta: {
        title: "CODA 19 - Dashboard",
        requiresAuth: true
      }
    }
]


const router = new VueRouter({
  routes,
  linkExactActiveClass: "active",
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('jwt') == null) {
      next({
        path: '/',
        params: { nextUrl: to.fullPath }
      })
    }else {
      next()
    }
    // else {
    //   let user = JSON.parse(localStorage.getItem('user'))
    //   if(to.matched.some(record => record.meta.is_admin)) {
    //     if(user.is_admin == 1){
    //       next()
    //     }
    //     else{
    //       next({ name: 'userboard'})
    //     }
    //   }else {
    //     next()
    //   }
    // }
  }else {
    next()
  }
})

export default router
