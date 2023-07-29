/// <reference types="vite/client" />
// 让其.vue文件适用于ts
declare module '*.vue' {
    import { ComponentOptions } from 'vue'
    const componentOptions: ComponentOptions
    export default componentOptions
}
