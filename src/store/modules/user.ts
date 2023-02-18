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

interface UserState {
  token: string;
  name: string;
  avatar: string;
  // like [ 'sys:user:add', 'sys:user:update' ]
  perms: string[];
  menus: RouteRecordRaw[];
//   userInfo: Partial<API.AdminUserInfo>;
}

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
    let router:RouteRecordRaw = 
    {
        path: menu.router,
        name: menu.name,
        //component: () => import(/* webpackChunkName: "layout" */ '@/layout/index.vue'),
        meta: {
          title: menu.name,
        },
        children: [],
    }

    return router;
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
    /** 登录 */
    async login() {
        try {
          //const { data } = await login(params);
          //this.setToken(data.token);
          return this.afterLogin();
        } catch (error) {
          return Promise.reject(error);
        }
      },
    /** 登录成功之后, 获取用户信息以及生成权限路由 */
    async afterLogin() {

        /* id: number,
        parentId: number,
        name: string,
        router: string,*/
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
    }
  }

  //向menus中写入路由信息

});

// 在组件setup函数外使用
export function useUserStoreWithOut() {
  return useUserStore(store);
}
