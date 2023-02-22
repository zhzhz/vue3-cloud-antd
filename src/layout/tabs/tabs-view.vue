<template>
    <div class="tabs-view">
      <!-- 界面顶端的tab，用来切换页面 -->
      <Tabs
        :active-key="activeKey"
        hide-add
        type="editable-card"
        class="tabs"
        @change="changePage"
        @edit="editTabItem"
      >
        <Tabs.TabPane v-for="pageItem in tabsList" :key="pageItem.fullPath">
          <template #tab>
            <Dropdown :trigger="['contextmenu']">
              <div style="display: inline-block">
                {{pageItem.meta?.title}}
              </div>
            </Dropdown>
          </template>
        </Tabs.TabPane>
      </Tabs>

      <!-- 页面主体，显示不同路由页面 -->
      <div class="tabs-view-content">
        <router-view v-slot="{ Component }">
          <keep-alive >
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </router-view>
      </div>

    </div>
</template>

<script setup lang="ts">
    import { computed, unref, watch ,ref} from 'vue';
    import { Dropdown, Tabs, message, Menu } from 'ant-design-vue';
    import { useTabsViewStore } from '@/store/modules/tabsView';
    import { useRoute, useRouter } from 'vue-router';
    import type { RouteLocation } from 'vue-router';

    type RouteItem = Omit<RouteLocation, 'matched' | 'redirectedFrom'>;

    const tabsViewStore = useTabsViewStore();
    const route = useRoute();
    const router = useRouter();

    /////////////////////////////////
    // const panes = ref<{ title: string; content: string; key: string; closable?: boolean }[]>([
    //   { title: 'Tab 1', content: 'Content of Tab 1', key: '1' },
    //   { title: 'Tab 2', content: 'Content of Tab 2', key: '2' },
    //   { title: 'Tab 3', content: 'Content of Tab 3', key: '3', closable: false },
    // ]);

    // const activeKey = ref(panes.value[0].key);
    /////////////////////////////////
    const activeKey = '0';
    

    //标签页列表
    const tabsList = computed(() => tabsViewStore.getTabsList);

    // 获取简易的路由对象
    const getSimpleRoute = (route): RouteItem => {
    const { fullPath, hash, meta, name, params, path, query } = route;
        return { fullPath, hash, meta, name, params, path, query };
    };

    let routes: RouteItem[] = [];
    routes = [getSimpleRoute(route)];

    //const activeKey = computed(() => routes[0]?.fullPath);

    // 初始化标签页
    //console.log("tabsViewStore routes", routes);
    tabsViewStore.initTabs(routes);

    // 切换页面
    const changePage = (key) => {
        Object.is(route.fullPath, key) || router.push(key);
    };

     // tabs 编辑（remove || add）
    const editTabItem = (targetKey, action: string) => {
    if (action == 'remove') {
        //removeTab(tabsList.value.find((item) => item.fullPath == targetKey));
    }
    };

    watch(
        () => route.path,
        () => {
        tabsViewStore.addTabs(getSimpleRoute(route));
        },
        { immediate: true },
    );

</script>


<style lang="less" scoped>

.dark .tabs-view {
    border-top: 1px solid black;
  }

  .tabs-view {
    border-top: 10px solid #eee;

    :deep(.tabs) {
      .ant-tabs-nav {
        @apply bg-white dark:bg-black;
        padding: 4px 20px 0 10px;
        margin: 0;
        user-select: none;
      }

      .ant-tabs-tabpane {
        display: none;
      }

      .ant-tabs-tab-remove {
        display: flex;
        padding: 0;
        margin: 0;

        .anticon-close {
          padding-left: 6px;
        }
      }

      .ant-tabs-tab:not(.ant-tabs-tab-active) {
        .ant-tabs-tab-remove {
          width: 0;
        }

        .anticon-close {
          width: 0;
          visibility: hidden;
          transition: width 0.3s;
        }

        &:hover {
          .anticon-close {
            width: 16px;
            visibility: visible;
            padding-left: 6px;
          }

          .ant-tabs-tab-remove {
            width: unset;
          }
        }
      }
    }

    .tabs-view-content {
      /* height: calc(100vh - #{$header-height}); */
      height: calc(100vh - 110px);
      padding: 20px 14px 0;
      overflow: auto;
      flex-direction: column;
      align-items: center;
      display: flex;
    }
  }
</style>
