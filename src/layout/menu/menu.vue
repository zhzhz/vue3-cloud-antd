<template>
    <div class="menu-container" :class="{ 'is-side-menu': isSideMenu }">
      <Menu
        v-model:selected-keys="state.selectedKeys"
        :open-keys="isSideMenu ? state.openKeys : []"
        :mode="isSideMenu ? 'inline' : 'horizontal'"
        :theme="theme"
        :collapsed="props.collapsed"
        collapsible
        @click="clickMenuItem"
      >
        <MenuItem :menus="menus" />
      </Menu>
    </div>
</template>

<script setup lang="ts">
  import { reactive, computed, watch, type PropType } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { Menu, type MenuTheme } from 'ant-design-vue';
  import MenuItem from './menu-item.vue';
  import { useUserStore } from '@/store/modules/user';
  import { useThemeStore } from '@/store/modules/projectConfig';
  import { LOGIN_NAME } from '@/router/constant';

  const props = defineProps({
    collapsed: {
      // 侧边栏菜单是否收起
      type: Boolean,
    },
    theme: {
      type: String as PropType<MenuTheme>,
    },
  });
  const userStore = useUserStore();
  const themeStore = useThemeStore();
  // 当前路由
  const currentRoute = useRoute();
  const router = useRouter();
  const state = reactive({
    openKeys: [] as string[],
    selectedKeys: [currentRoute.name] as string[],
  });

  const menus = computed(() => {
    console.log("userStore.menus", userStore.menus);
    return userStore.menus;
});

  /** 侧边栏布局 */
  const isSideMenu = computed(() => themeStore.layout === 'sidemenu');


  // 点击菜单
  const clickMenuItem = ({ key }) => {
    console.log("clickMenuItem", key);
    // if (key === currentRoute.name) return;
    // const targetRoute = getRouteByName(key);
    // const { isExt, openMode } = targetRoute?.meta || {};
    // if (isExt && openMode !== 2) {
    //   //console.log('window.open(key);');
    //   window.open(key);
    // } else {
    //   //console.log('router.push({ name: key });');
    //   router.push({ name: key });
    // }
  };
</script>


<style lang="less" scoped>
  .menu-container {
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    &.is-side-menu {
      height: calc(100vh - 64px);
    }
  }
</style>
