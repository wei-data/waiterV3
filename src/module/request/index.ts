import axios from "axios"
import router from "../router";
const request = axios.create({
    baseURL: 'http://127.0.0.1:5000',
    timeout: 20000,
    headers:{
        "Content-Type": "application/json;charset=utf-8",
    }
})
// request.header('Access-Control-Allow-Origin: *')
request.interceptors.request.use((config:any) => {
    const token:string = localStorage.getItem('token') || ''
    if (token) {
        config.headers.Authorization = token
    } else {
        console.log('需要设置拦截器')
    }
    return config
}, error => {
    // 处理请求错误
    return Promise.reject(error)
})
request.interceptors.response.use((response) => {
    //登录超时
    if (response.data.code == 400) {
        router.push('/').then((r:any):void =>{ console.log(r)} )
    }
    const {data} = response
    return data;
}, function (error) {
    return Promise.reject(error);
});
// // 移除请求拦截器
// request.interceptors.request.eject(interceptorsRequest);
// // 移除响应拦截器
// request.interceptors.response.eject(interceptorsResponse);
export default request
