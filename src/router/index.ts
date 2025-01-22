import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthRoutes';

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/:pathMatch(.*)*',
            component: () => import('@/views/auth/Error.vue')
        },
        MainRoutes,
        AuthRoutes
    ]
});

router.beforeEach((to: any, from: any, next: any) => {
    // Tipe data untuk 'to', 'from', dan 'next'
    const isAuthenticated = localStorage.getItem('access_token'); // Mendapatkan token autentikasi

    if (to.meta.requiresAuth && !isAuthenticated) {
        // Jika route memerlukan autentikasi dan pengguna belum login
        next({
            path: '/auth/login',
        });
    } else if (!to.meta.requiresAuth && isAuthenticated && to.path === '/auth/login') {
        // Jika sudah login dan mencoba mengakses login, redirect ke dashboard
        next({ path: '/dashboard' });
    } else {
        // Lanjutkan ke route tujuan
        next();
    }
});