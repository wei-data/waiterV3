import { defineStore } from 'pinia'
// @ts-ignore
import {ElLoading,ElMessage} from "element-plus";
// import {getCurrentInstance} from "vue";
import request from "../request";
// @ts-ignore

export default defineStore('storeIdA', {
    // 其他配置...
    state: ()=>{
        return{
            // 原始数据商品列表
            orderList: {}
        }
    },
    // pinia中的getters与vuex中的一摸一样
    getters: {
    },
    // 同步异步统一到actions中了
    actions: {

    }
});

export class useStore {
}
