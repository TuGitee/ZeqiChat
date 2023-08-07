export default [
    {
        name: 'home',
        path: '/home',
        component: () => import('@/views/Home'),
        children: [
            {
                name: 'chat',
                path: 'chat/:id',
                component: () => import('@/views/Home/Chat')
            }
        ]
    },
    {
        name: 'login',
        path: '/login',
        component: () => import('@/views/Login')
    },
    {
        name: 'register',
        path: '/register',
        component: () => import('@/views/Register')
    },
    {
        path: '/',
        redirect: '/login'
    },
    {
        name: 'error',
        path: '*',
        component: () => import('@/views/Error')
    },
]