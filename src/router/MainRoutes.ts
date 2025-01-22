const MainRoutes = {
    path: '/main',
    meta: {
        requiresAuth: true
    },
    redirect: '/main',
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
        {
            name: 'Dashboard',
            path: '/dashboard',
            component: () => import('@/views/dashboard/index.vue')
        },
        {
            name: 'Jobs',
            path: '/jobs',
            component: () => import('@/views/jobs/index.vue')
        },
        {
            name: 'Divisions',
            path: '/divisions',
            component: () => import('@/views/divisions/index.vue')
        }
    ]
};

export default MainRoutes;
