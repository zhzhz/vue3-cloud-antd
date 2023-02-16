<template>
    <div class="login-box">
      <div class="login-logo">
        <!-- <svg-icon name="logo" :size="45" /> -->
        <img src="~@/assets/images/logo.png" width="45" />
        <h1 class="mb-0 ml-2 text-3xl font-bold">智能设备管理系统</h1>
      </div>
      <a-form layout="horizontal" :model="state.formInline" @submit.prevent="handleSubmit">
        <a-form-item>
          <a-input v-model:value="state.formInline.username" size="large" placeholder="rootadmin">
            <template #prefix><user-outlined type="user" /></template>
          </a-input>
        </a-form-item>

        <a-form-item>
          <a-input
            v-model:value="state.formInline.password"
            size="large"
            type="password"
            placeholder="123456"
            autocomplete="new-password"
          >
            <template #prefix><lock-outlined type="user" /></template>
          </a-input>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" size="large" :loading="state.loading" block>
            登录
          </a-button>
        </a-form-item>

      </a-form>
    </div>
</template>


<script lang="ts" setup>
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { message, Modal } from 'ant-design-vue';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons-vue';

const state = reactive({
    loading: false,
    captcha: '',
    formInline: {
      username: '',
      password: '',
      verifyCode: '',
      captchaId: '',
    },
  });

const router = useRouter();
const route = useRoute();

const handleSubmit = async () => {
    const { username, password, verifyCode } = state.formInline;
    if (username.trim() == '' || password.trim() == '') {
      return message.warning('用户名或密码不能为空！');
    }

    message.loading('登录中...', 0);
    state.loading = true;

    if (username == '111' && password == '111')
    {
        message.success('登录成功！');
        router.replace((route.query.redirect as string) ?? '/');
    }
    else
    {
        Modal.error({
        title: () => '提示',
        content: () => "用户名密码有误",
      });
    }
    state.loading = false;
    message.destroy();
    
}

// const doLogin = () =>{
//     //跳转到主界面
//     console.log("button down", route.query.redirect);
//     router.replace((route.query.redirect as string) ?? '/');
// }
</script>

<style lang="less" scoped>
  .login-box {
    display: flex;
    width: 100vw;
    height: 100vh;
    padding-top: 240px;
    //background: url('~@/assets/login.svg');
    background-size: 100%;
    flex-direction: column;
    align-items: center;

    .login-logo {
      display: flex;
      margin-bottom: 30px;
      align-items: center;

      .svg-icon {
        font-size: 48px;
      }
    }

    :deep(.ant-form) {
      width: 400px;

      .ant-col {
        width: 100%;
      }

      .ant-form-item-label {
        padding-right: 6px;
      }
    }
  }
</style>