import { defineStore } from 'pinia';
import type { RouteLocationNormalized } from 'vue-router';

import type { RouteLocation } from 'vue-router';

type RouteItem = Omit<RouteLocation, 'matched' | 'redirectedFrom'>;

interface TabsViewState {
    /** 标签页 */
    tabsList: RouteItem[];
}

export const useTabsViewStore = defineStore({
    id: 'tabs-view',
    state: (): TabsViewState => ({
      tabsList: [],
    }),
    getters: {
      getTabsList: (state) => {
        // const tt = state.tabsList.filter((item) => {
        //   return !item.meta?.hideInTabs && router.hasRoute(item.name!);
        // });
        // console.log('tt', tt);
        return state.tabsList;
      },
    //   /** 当前activity tab */
    //   getCurrentTab: (state) => {
    //     const currentRoute = router.currentRoute.value!;
    //     return state.tabsList.find((item) => {
    //       return !item.meta?.hideInTabs && item.fullPath === currentRoute.fullPath;
    //     });
    //   },
    },
    actions: {
        /** 初始化标签页 */
        initTabs(routes:RouteItem[]) {
        this.tabsList = routes;
      },

    /** 添加标签页 */
    addTabs(route:RouteItem): boolean {
      console.log("addTabs", route.path)
      const isExists = this.tabsList.some((item) => item.path == route.path);
      if (!isExists) {
        this.tabsList.push(route);
      }
      return true;
    },
    }
})