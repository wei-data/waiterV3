<script setup lang="ts">
import {useRoute ,useRouter} from 'vue-router'
import {ref} from "vue";
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import {
  Document,
  Menu as IconMenu,
  Location
} from '@element-plus/icons-vue'
// import router from "../module/router";
const router = useRouter()
const route = useRoute()
// console.log(route.matched)
let active = ref(route.path)
const opened = ref([`${route.meta.module}`])

const handleCommand = (command: string | number | object) => {
  ElMessage(`${command}成功，欢迎下次光临`)
}
const quit = () =>{
  localStorage.removeItem('token')
  router.push({
    path: '/logIn'
  })
}
</script>

<template>
  <el-container style="width: 100vw;height: 100vh">
    <el-aside width="200px" style="background: #545c64">
      <img src="../assets/logo.png" style="width: 50px;height: 50px;margin:10px 75px" alt="logo">
      <el-menu
          :default-active="active"
          :default-openeds="opened"
          class="el-menu-vertical-demo"
          router
      >
        <el-menu-item index="/Main/Index">
          <el-icon><icon-menu /></el-icon>
          <span>后台首页</span>
        </el-menu-item>
        <el-menu-item index="/Main/OrderManagement">
          <el-icon><icon-menu /></el-icon>
          <span>订单管理</span>
        </el-menu-item>
        <el-sub-menu index="商品管理">
          <template #title>
            <el-icon><location /></el-icon>
            <span>商品管理</span>
          </template>
            <el-menu-item index='/Main/proList'>商品列表</el-menu-item>
            <el-menu-item index="/Main/append">商品添加</el-menu-item>
          <el-menu-item index="/Main/Sort">商品分类</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/Main/shop">
          <el-icon><document /></el-icon>
          <span>店铺管理</span>
        </el-menu-item>
        <el-sub-menu index="账户管理">
          <template #title>
            <el-icon><location /></el-icon>
            <span>账户管理</span>
          </template>
          <el-menu-item index='/Main/AccountList'>账户列表</el-menu-item>
          <el-menu-item index="/Main/AccountAdd">添加账号</el-menu-item>
          <el-menu-item index="/Main/AccountEdit">修改密码</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="销售统计">
          <template #title>
            <el-icon><location /></el-icon>
            <span>销售统计</span>
          </template>
          <el-menu-item index="/Main/shopStatistics">商品统计</el-menu-item>
          <el-menu-item index="/Main/OrderStatistics">订单统计</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="display: flex; align-items: center;justify-content: space-between">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: item.path }" v-for="(item,index) of route.matched" :key="index">
              {{ item.meta.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <div style="display: flex;align-items: center">
          <router-link to="/Main/personage"><el-avatar  style="margin-right: 10px" :size="50"  src="" /></router-link>
          <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            下拉更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="退出登录" @click="quit">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main style="background: #f0f2f5; padding: 20px">
        <div style="background: white; height: 100%;width: 100%; padding: 20px;box-sizing: border-box">
          <transition name="router_animate">
            <router-view>
          </router-view>
          </transition>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
::v-deep .el-menu-item, ::v-deep .el-sub-menu__title {
  background: #545c64;
  color: white;
}
::v-deep .el-menu-item.is-active{
  background: #be8b2d;
  color: white;
}
</style>
