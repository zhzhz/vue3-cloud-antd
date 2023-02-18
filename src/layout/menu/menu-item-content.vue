<template>
    <!-- <icon-font :type="item?.meta?.icon" />
    <TitleI18n :title="item?.meta?.title" /> -->
    <div>{{ item?.meta?.title }}</div>
</template>

<script lang="ts">
  export default {
    name: "MenuItemContent"
  }
</script>
  
  <script lang="ts" setup>
    import type { RouteRecordRaw } from 'vue-router';
    import type { PropType } from 'vue';
  
    defineProps({
      item: {
        type: Object as PropType<RouteRecordRaw>,
        default: () => ({}),
      },
    });
  </script>