import { defineStore } from 'pinia'
// @ts-ignore
import {ElLoading,ElMessage} from "element-plus";
// import {getCurrentInstance} from "vue";
import request from "../request";


export default defineStore('storeId', {
    // 其他配置...
    state: ()=>{
        return{
            // 原始数据商品列表
            echartsData: {
                todayOrder: '',
                totalAmount: '',
                totalOrder: '',
                totayAmount: ''
            }
        }
    },
    // pinia中的getters与vuex中的一摸一样
    getters: {
    },
    // 同步异步统一到actions中了
    actions: {
        async request() {
            const data = await request.get('/order/totaldata')
            // @ts-ignore
             this.echartsData = data
            console.log('请求：',this.echartsData)
        }
    }
});

export class useStore {
}
