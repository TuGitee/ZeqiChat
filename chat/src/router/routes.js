export default [
    {
        name: 'home',
        path: '/home',
        component: () => import('@/views/Home'),
        children: [
            {
                name: 'chat',
                path: 'chat/:id(\\d+)',
                component: () => import('@/views/Home/Chat'),
                meta: {
                    title: '聊天',
                    icon: 'el-icon-chat-round'
                },

            },
            {
                name: "blog",
                path: 'blog/:id(\\d+)',
                component: () => import('@/views/Home/Blog'),
                meta: {
                    title: '动态',
                    icon: 'el-icon-postcard'
                }
            },
            {

                name: 'post',
                path: 'post',
                component: () => import('@/views/Home/Blog/Post'),
            }
        ],
        beforeEnter: (to, from, next) => {
            if (localStorage.getItem('token')) {
                next()
            } else {
                next('/user')
            }
        }
    },
    {
        name: 'user',
        path: '/user',
        component: () => import('@/views/User')
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