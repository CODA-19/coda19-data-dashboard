import VueRouter from 'vue-router'
import Home from '@/views/Home'
import AppHeader from '@/components/AppHeader'
import Footer from '@/components/Footer'
import About from '@/views/About'
import SelectData from '@/views/SelectData'
import Connections from "@/views/Connections";
import UI from '@/views/UI'
import Forest from "@/components/Forest"


const routes = [
  {
    path: '/',
    name: 'Home',
    components: {
      header: AppHeader,
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
      header: AppHeader,
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
      header: AppHeader,
      default: SelectData,
      footer: Footer
    },
    meta: {
      title: "CODA 19 - Data selection"
    }
  },
  {
    path: '/ui',
    name: 'UI',
    components: {
      header: AppHeader,
      default: UI,
      footer: Footer
    },
    meta: {
      title: "CODA 19 - UI Dashboard - (Connected data selection)"
    }
  },
  {
    path: '/forest',
    name: 'Forest',
    components: {
      header: AppHeader,
      default: Forest,
      footer: Footer
    },
    meta: {
      title: "CODA 19 - Forest"
    }
  },
  {
    path: '/connections',
    name: 'Connections',
    components: {
      header: AppHeader,
      default: Connections,
      footer: Footer
    },
    meta: {
      title: "CODA 19 - Connections"
    }
  }
]


const router = new VueRouter({
  routes,
  linkExactActiveClass: "active",
})

export default router
