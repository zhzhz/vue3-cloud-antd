<template>
    <a-button type="primary" @click="doLogin">请登录</a-button>
</template>

<script lang="ts" setup>

import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const doLogin = () =>{
    //跳转到主界面
    console.log("button down", route.query.redirect);
    router.replace((route.query.redirect as string) ?? '/');
}
</script>