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
      path: '/forest',
      name: 'Forest',
      components: {
        header:AppHeader,
        default: Home,
        footer: Footer
      },
      meta: {
        title: "CODA 19 - Forest"
      }
    }
]


const router = new VueRouter({
  routes,
  linkExactActiveClass: "active",
})

export default router
