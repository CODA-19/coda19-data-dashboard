import VueRouter from 'vue-router'
import Home from '@/views/Home'
import Stats from '@/views/Stats'
import AppHeader from '@/components/AppHeader'
import Footer from '@/components/Footer'
import HomeMetrics from '@/views/HomeMetrics'
import Learning from '@/views/Learning'
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
        path: '/stats',
        name: 'Stats',
        components: {
            header: AppHeader,
            default: Stats,
            footer: Footer
        },
        meta: {
            title: "CODA 19 - Stats"
        }
    },
    {
        path: '/homemetrics',
        name: 'HomeMetrics',
        components: {
            header: AppHeader,
            default: HomeMetrics,
            footer: Footer
        },
        meta: {
            title: "CODA 19 - HomeMetrics"
        }
    },
    {
        path: '/learning',
        name: 'Learning',
        components: {
            header: AppHeader,
            default: Learning,
            footer: Footer
        },
        meta: {
            title: "CODA 19 - Learning"
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
