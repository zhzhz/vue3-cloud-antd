import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

import type { App } from 'vue';

import outsideLayout from './outsideLayout';

import { createRouterGuards } from './router-guards';

import { whiteNameList } from './constant';

// const routes: Array<RouteRecordRaw> = [
//   {
//     path: '/',
//     name: 'home',
//     component: HomeView
//   },
//   {
//     path: '/about',
//     name: 'about',
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
//   }
// ]

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Layout',
    redirect: '/sys/readAndWrite',
    component: () => import(/* webpackChunkName: "layout" */ '@/layout/index.vue'),
    meta: {
      title: '首页',
    },
    children: [],
  },
  // {
  //   path: '/dashboard/welcome',
  //   name: 'welcome',
  //   component: () => import(/* webpackChunkName: "layout" */ '@/layout/index.vue'),
  //   meta: {
  //     title: '演示用的暂时的静态首页，之后首页会动态创建',
  //   },
  //   children: [],
  // },
  //Layout之外的路由
  ...outsideLayout,
];


const router = createRouter({
  history: createWebHistory(''),
  routes
})

export async function setupRouter(app: App) {
  // 创建路由守卫
  createRouterGuards(router, whiteNameList);
  // console.log("router.isReady1");
  app.use(router);

  // 路由准备就绪后挂载APP实例
  await router.isReady();

  // console.log("router.isReady2");
}

export default router
