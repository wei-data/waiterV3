import { createApp } from 'vue'
import 'animate.css/animate.min.css'
import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from "./module/router";
// import request from "./module/request";
import {createPinia} from 'pinia'
import App from './App.vue'


const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(createPinia()).use(router).use(ElementPlus).mount('#app')
