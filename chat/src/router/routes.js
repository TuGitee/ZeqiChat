export default [
    {
        name: 'home',
        path: '/home',
        component: () => import('@/views/Home'),
        children: [
            {
                name: 'chat',
                path: 'chat/:id',
                component: () => import('@/views/Home/Chat'),
                meta: {
                    title: '聊天',
                    icon: 'el-icon-chat-round'
                }
            },
            {
                name: "blog",
                path: 'blog/:id',
                component: () => import('@/views/Home/Blog'),
                meta: {
                    title: '动态',
                    icon: 'el-icon-postcard'
                },
            },
            {

                name: 'post',
                path: 'post',
                component: () => import('@/views/Home/Blog/Post'),
            }
        ],
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
        name: 'loading',
        component: () => import('@/views/Loading')
    },
    {
        name: 'error',
        path: '*',
        component: () => import('@/views/Error')
    },
]