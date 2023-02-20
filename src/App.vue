<template>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view/> -->

  <!-- <a-button type="primary">你好</a-button> -->
  <router-view #="{ Component }">
      <component :is="Component" />
  </router-view>

</template>

<script lang="ts" setup>

</script>

<style lang="less">
</style>
