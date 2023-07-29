<script setup lang="ts">
import useStore from "../../../module/store";
import pieChart from './pieChart.vue';
const store = useStore()
store.request()
console.log(store.echartsData)

</script>

<template>
  <div>
  <ul style="width: 100%;display: flex;justify-content: space-around;">
    <li>
      <el-icon><MessageBox /></el-icon>
      <div>
        <h3>总订单</h3>
        <p>{{store.echartsData.todayOrder}}</p>
      </div>
    </li>
    <li>
      <el-icon><PieChart /></el-icon>
      <div>
        <h3>总订单</h3>
        <p>{{store.echartsData.totalAmount}}</p>
      </div>
    </li>
    <li>
      <el-icon><Tickets /></el-icon>
      <div>
        <h3>总订单</h3>
        <p>{{store.echartsData.totalOrder}}</p>
      </div>
    </li>
    <li>
      <el-icon><Collection /></el-icon>
      <div>
        <h3>总订单</h3>
        <p>{{store.echartsData.totayAmount}}</p>
      </div>
    </li>
  </ul>
  <pieChart></pieChart>
  </div>
</template>

<style scoped lang="scss">
ul{
  padding-top: 20px;
  li {
    width: 23%;
    height: 200px;
    border-radius: 20px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: #b9c1cc;

    .el-icon {
      font-size: 100px;
    }
  }
}
</style>
