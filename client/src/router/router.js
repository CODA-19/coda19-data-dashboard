import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
import AppHeader from '@/components/AppHeader'
import Footer from '@/components/Footer'
import About from '@/views/About'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    components: {
      header:AppHeader,
      default: Home,
      footer: Footer
    },
    // props: {
    //   default:{
    //     select: 'home'
    //   }
    // },
    meta: {
      title: "CODA 19"
    }
  },
  {
    path: '/about',
    name: 'About',
    components: {
      header:AppHeader,
      default: About
    },
    // props: {
    //   default:{
    //     select: 'about'
    //   }
    // },
    meta: {
      title: "CODA 19 - About"
    }
  }
]


const router = new VueRouter({
  routes,
  linkExactActiveClass: "active",
})

export default router
