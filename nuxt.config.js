/*
  Nuxt.js配置文件
*/

module.exports = {
  router: {
    //路由激活样式
    linkActiveClass: 'active',
    //自定义路由
    extendRoutes(routes, resolve) {
      //清除 nuxt.js基于pages目录默认生成的路由表
      routes.splice(0)
      routes.push(...[
        {
          path: '/',
          component: resolve(__dirname, 'pages/layout/'),
          children: [
            {
              path: '',//默认子路由
              name: 'home',
              component: resolve(__dirname, 'pages/home/'),
            },
            {
              path: '/login',
              name: 'login',
              component: resolve(__dirname, 'pages/login/'),
            },
            {
              path: '/register',
              name: 'register',
              component: resolve(__dirname, 'pages/login/'),
            },
            {
              path: '/profile/:username',
              name: 'profile',
              component: resolve(__dirname, 'pages/profile/'),
            },
            {
              path: '/settings',
              name: 'settings',
              component: resolve(__dirname, 'pages/settings/'),
            },
            {
              path: '/editor/:slug?',
              name: 'editor',
              component: resolve(__dirname, 'pages/editor/'),
            },
            {
              path: '/article/:slug',
              name: 'article',
              component: resolve(__dirname, 'pages/article/'),
            },
            {
              path: '/404',
              name: '404',
              component: resolve(__dirname, 'pages/404/'),
            }
          ]
        }
      ])

    }
  },
  //配置服务器参数
  server: {
    host: '0.0.0.0',
    port: "3333"
  },
  //注册插件
  plugins: [
    '~/plugins/request.js',
    '~/plugins/dayjs.js'
  ]

}