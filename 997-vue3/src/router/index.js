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
            path: '/:pathMatch(.*)*',
            redirect: '/network-connection-test'
        }
    ],
})

export default router