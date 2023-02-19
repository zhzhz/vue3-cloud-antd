import type { Router, RouteLocationNormalized } from 'vue-router';
import type { WhiteNameList } from './constant';
import { LOGIN_NAME, REDIRECT_NAME } from './constant';
import { ACCESS_TOKEN_KEY } from '@/enums/cacheEnum';
import { Storage } from '@/utils/Storage';


//这个函数，用来管理跳转到哪个路由上
export function createRouterGuards(router: Router, whiteNameList: WhiteNameList)
{
    //进入一个路由之前的钩子
    //当是Login路由时，直接进入
    //反之是其他路由，先跳转到login界面，登录成功后再跳转到对应界面
    //如果从服务器拿到token，就不用进入登录页面
    
    //Storage.clear();
     
    
    //console.log("token", token);

    router.beforeEach(async (to, _, next) => {
        //console.log("to.fullPath", to.fullPath);
        //console.log("beforeEach")
        const token = Storage.get(ACCESS_TOKEN_KEY, null); 
        if (token)
        {
            next();
        }
        else
        {
            //not login
            if (whiteNameList.some((n) => n === to.name)) {
                //在免登录名单，直接进入
                //console.log("whiteNameList", to.name)
                next();
            } else {
                next({ name: LOGIN_NAME, query: { redirect: to.fullPath }, replace: true });
            }
        }
        
    })
}