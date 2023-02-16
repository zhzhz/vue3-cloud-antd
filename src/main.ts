import { createApp } from 'vue'
import App from './App.vue'
//import router from './router'
import { setupRouter } from './router';
import {setupAntd} from '@/plugins';

const app = createApp(App);

function setupPlugins()
{
    setupAntd(app);//安装antd
}

async function setupApp() 
{
    // 挂载vuex状态管理
    //setupStore(app);

    //await setupI18n(app);
    // 挂载路由
    await setupRouter(app);
  
    app.mount('#app');
}

setupPlugins();
// console.log("setupApp");
setupApp();

// .use(router).mount('#app')
