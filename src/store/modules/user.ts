import { defineStore } from 'pinia';
// import { useWsStore } from './ws';
import type { RouteRecordRaw } from 'vue-router';
import { store } from '@/store';
// import { login } from '@/api/login';
import { ACCESS_TOKEN_KEY } from '@/enums/cacheEnum';
// import { Storage } from '@/utils/Storage';
// import { logout, getInfo, permmenu } from '@/api/account';
// import { generatorDynamicRouter } from '@/router/generator-router';
// import { resetRouter } from '@/router';
import router, { routes } from '@/router';

import axios from "axios";

import { Storage } from '@/utils/Storage';

interface UserState {
  token: string;
  name: string;
  avatar: string;
  // like [ 'sys:user:add', 'sys:user:update' ]
  perms: string[];
  menus: RouteRecordRaw[];
//   userInfo: Partial<API.AdminUserInfo>;
}

let allRouters:RouteRecordRaw[] = [];//所有生成的动态路由都保存在这

/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = (asyncMenus: API.Menu[][]) => {
    try {
        let dynamicRouterArray:RouteRecordRaw[] = [];

        console.log("asyncMenus", asyncMenus);

        handleMenus(dynamicRouterArray, asyncMenus, 0);

        /////////////////////////////////////////////////////////////////
        const layout = routes.find((item) => item.name == 'Layout')!;
        const removeRoute = router.addRoute(layout);
        removeRoute();

        //将没有children的子动态路由，添加到router中
        for (let i = 0; i < allRouters.length; i++)
        {
          let router_ = allRouters[i];
          if (router_?.children?.length == 0)
          {
            layout?.children?.push(router_);
          }
        }

        // 重新添加路由
        router.addRoute(layout);

        console.log("所有路由", router.getRoutes());

        return Promise.resolve({
            menus: dynamicRouterArray
        });
    } catch (error) {
        console.error('生成路由时出错', error);
        return Promise.reject(`生成路由时出错: ${error}`);
    }
}

let id2rourter = new Map();


function handleMenus(dynamicRouterArray:RouteRecordRaw[], asyncMenus:API.Menu[][], deepCnt:number)
{
    let asyncMenus_ = asyncMenus[deepCnt];

    for (let i = 0; i < asyncMenus_.length; i++)
    {
        let menus:API.Menu = asyncMenus_[i];

        let dynamicRouter:RouteRecordRaw = genDynamicRouter(menus);

        id2rourter.set(menus.id, dynamicRouter);

        dynamicRouterArray.push(dynamicRouter);

        //如果有parentId，则挂载到parent上去
        if (menus.parentId)
        {
            //寻找parentId对应的router,并挂载上去
            id2rourter.get(menus.parentId).children.push(dynamicRouter);
        }
    }

    //如果当前处理的不是最后一个asyncMenus，递归处理
    if(deepCnt != asyncMenus.length-1)
    {
        deepCnt++;

        let dynamicRouterArray:RouteRecordRaw[] = [];

        handleMenus(dynamicRouterArray, asyncMenus, deepCnt);
    }
}

//根据menu创建路由
function genDynamicRouter(menu:API.Menu):RouteRecordRaw
{
    //menu显示是item?.meta?.title
    let newRouter:RouteRecordRaw = 
    {
        path: menu.router,
        name: menu.name,
        component: () => import('@/views'+ menu.router + '/index.vue'),
        meta: {
          title: menu.name,
        },
        children: [],
    }

    //将生成的新路由加入到路由数组中去
    //后面需要添加到Layout路由的children中去
    //这样才能实现更变子路由，不改变父路由的功能
    allRouters.push(newRouter);

    return newRouter;
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    // token: Storage.get(ACCESS_TOKEN_KEY, null),
    token: '111111',
    name: 'amdin',
    avatar: '',
    perms: [],
    menus: [],
    // userInfo: {},
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getAvatar(): string {
      return this.avatar;
    },
    getName(): string {
      return this.name;
    },
    getPerms(): string[] {
      return this.perms;
    },
  },
  actions: {
    /** 登录成功保存token */
    setToken(token: string) {
        this.token = token ?? '';
        const ex = 7 * 24 * 60 * 60 * 1000;
        Storage.set(ACCESS_TOKEN_KEY, this.token, ex);
        
    },

    /** 登录 */
    async login() {
        let token = '';
        try {
          //const { data } = await login(params);
          //this.setToken(data.token);

            //向服务器登录，拿到token
            let url = "http://127.0.0.1:3000/login";

            let dataObj = {
                username:"111",
                password:"111"
            };

            await axios.post(url, dataObj).then(function (response) {
                console.log('axios', response);

                //设置token
                token = response.data.token;
            })
            .catch(function (error) {
                console.log(error);
            });

            this.setToken(token);

            return this.afterLogin();
        } catch (error) {
          return Promise.reject(error);
        }
      },
    /** 登录成功之后, 获取用户信息以及生成权限路由 */
    async afterLogin() {

        try{
            let menus1:API.Menu[] = [];
            menus1.push({id:1, parentId:null, name:"系统监控", router:'/sys'});
            menus1.push({id:2, parentId:null, name:"表格", router:'/table'});
            menus1.push({id:3, parentId:null, name:"曲线", router:'/curve'});

            let menus2:API.Menu[] = [];
            menus2.push({id:4, parentId:1, name:"监控", router:'/sys/readAndWrite'});
            menus2.push({id:5, parentId:2, name:"设备表格", router:'/table/devTable'});
            menus2.push({id:6, parentId:3, name:"设备曲线", router:'/curve/devCurve'});

            let menus:API.Menu[][] = [menus1, menus2];//从服务器拿，现在直接写死
            const generatorResult = await generatorDynamicRouter(menus);//根据menu创建动态路由

            this.menus = generatorResult.menus;//将动态路由挂载到menus上

            return menus;
        }catch (error)
        {
            return Promise.reject(error);
        }
    }
  }

  //向menus中写入路由信息

});

// 在组件setup函数外使用
export function useUserStoreWithOut() {
  return useUserStore(store);
}
