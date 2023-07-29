import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    // 历史储存，可以进行浏览器前进后退功能createWebHistory（）
    history: createWebHistory(),
    routes: [
        {
            path: '',
            redirect: '/logIn' // 将根路径重定向到 '/home'
        },
        {
            path: '/logIn',
            name: '登录/注册页',
            component: () => import('../../view/logIn.vue')
        },
        {
            path: '/Main',
            meta: {
                title: '主页',
                module: '主页'
            },
            component: () => import('../../view/Main.vue'),
            children: [
                {
                    path: '',
                    redirect: '/Main/Index'
                },
                {
                    path: 'Index',
                    name: '首页',
                    meta: {
                        title: '首页'
                    },
                    component: () => import('../../view/main/index/index.vue'),
                },{
                    path: 'OrderManagement',
                    name: '订单管理',
                    meta: {
                        title: '订单管理'
                    },
                    component: () => import('../../view/main/Management/OrderManagement.vue'),
                },{
                    path: 'proList',
                    name: '商品列表',
                    meta: {
                        title: '商品列表',
                        module: '商品管理'
                    },
                    component: () => import('../../view/main/pro/proList.vue'),
                },{
                    path: 'append',
                    name: '添加商品',
                    meta: {
                        title: '添加商品',
                        module: '商品管理'
                    },
                    component: () => import('../../view/main/pro/append.vue'),
                },{
                    path: 'Sort',
                    name: '商品分类',
                    meta: {
                        title: '商品分类',
                        module: '商品管理'
                    },
                    component: () => import('../../view/main/pro/Sort.vue'),
                },{
                    path: 'shop',
                    name: '店铺管理',
                    meta: {
                        title: '店铺管理',
                        module: '店铺管理'
                    },
                    component: () => import('../../view/main/shop/shop.vue'),
                },{
                    path: 'AccountList',
                    name: '账号管理',
                    meta: {
                        title: '账号列表',
                        module: '店铺管理'
                    },
                    component: () => import('../../view/main/account/Account.vue'),
                },{
                    path: 'AccountAdd',
                    name: '账号添加',
                    meta: {
                        title: '账号添加',
                        module: '店铺管理'
                    },
                    component: () => import('../../view/main/account/Add.vue'),
                },{
                    path: 'AccountEdit',
                    name: '修改密码',
                    meta: {
                        title: '修改密码',
                        module: '店铺管理'
                    },
                    component: () => import('../../view/main/account/Edit.vue'),
                },{
                    path: 'OrderStatistics',
                    name: '订单统计',
                    meta: {
                        title: '订单统计',
                        module: '销售统计'
                    },
                    component: () => import('../../view/main/Statistics/Order.vue'),
                },{
                    path: 'shopStatistics',
                    name: '商品统计',
                    meta: {
                        title: '商品统计',
                        module: '销售统计'
                    },
                    component: () => import('../../view/main/Statistics/shop.vue'),
                },{
                    path: 'personage',
                    name: '个人中心',
                    meta: {
                        title: '管理员信息'
                    },
                    component: () => import('../../view/personage/personage.vue')
                }],
        }]
})

// 路由前置守卫
router.beforeEach((to: object, from, next: object) => {
    // 这里是你的权限控制逻辑
    // 检查登录状态、用户权限等
    // 如果符合条件，调用 next() 进行路由切换
    // 如果不符合条件，可以调用 next(false) 阻止路由切换
    // console.log(from)
    let token = localStorage.getItem('token')
    // @ts-ignore
    if (!token && to.path !== '/login') {
        // console.log("/login")
        console.log(from)
        // @ts-ignore
        next('/login')
    } else {
        // console.log("/login")
        // @ts-ignore
        next()
    }
});
router.afterEach(()=>{

})
export default router;
