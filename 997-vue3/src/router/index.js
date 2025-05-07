import {
    createRouter,
    createWebHistory
} from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/network-connection-test',
            name: 'NetworkConnectionTest',
            component: () => import('../views/NetworkConnectionTest.vue')
        },
        {
            // 自定义指令
            path: '/custom-directive',
            name: 'CustomDirective',
            component: () => import('../views/CustomDirective.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/network-connection-test'
        }
    ],
})

export default router