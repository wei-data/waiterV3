<template>
  <div id="box" ref="box" style="width: 100%;height:500px;margin-top: 50px"></div>
<!--  {{store.echartsData}}-->
</template>

<script setup>
import {onMounted, ref} from 'vue';
import * as echarts from 'echarts';
import useStore from '../../../module/store/index'
// 使用store
const store = useStore()
store.request()
// 第一次渲染正常，刷新之后数据为空
console.log('echarts图标中抓取数据',store.echartsData)
const data = store.echartsData
let box = ref(null)
onMounted(()=>{
    // 定义子组件需要传递给父组件的实例
    // 使用 provide 提供实例
    let myeCharts = echarts.init(box.value)
    myeCharts.dispose();
    // 通过ref属性来获取图表的实例
    myeCharts = echarts.init(box.value)
    // let myeCharts = echarts.init(box.value);
    const option = {
      title: {
        text: '数据统计',
        top: 40,
        left: 20
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['订单', '销售额', '注册人数', '管理员人数'],
        top: 50
      },
      grid: {
        left: '3%',
        right: '4%',
        top: '20%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.xData
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: true
        }
      },
      series: [
        {
          name: '订单',
          type: 'line',
          stack: 'Total',
          data: data.amountData,
          color: '#c53e3a'
        },
        {
          name: '注册人数',
          type: 'line',
          stack: 'Total',
          data: data.orderData,
          color: '#6aa6ad'
        },
        {
          name: '管理员人数',
          type: 'line',
          stack: 'Total',
          data: data.amountData,
          color: '#d48265'
        },
        {
          name: '销售额',
          type: 'line',
          stack: 'Total',
          data: data.orderData,
          color: '#394e5c'
        }
      ]
    }
    myeCharts.setOption(option)
    window.onresize = function(){
      console.log('窗口大小发生改变了')
      // echarts适配
      myeCharts.resize();
    }
})
window.addEventListener("beforeunload", () => {
  localStorage.setItem("userComMsg", JSON.stringify(store));
});
//在页面加载时读取localStorage里的状态信息
if (localStorage.getItem("userComMsg")) {
  Object.assign(
      store,
      JSON.parse(localStorage.getItem("userComMsg"))
  );
  //使用后清除内存
  setTimeout(function () {
    localStorage.removeItem("userComMsg");
  }, 300);
}
</script>

<style lang="scss" scoped>
#box{
  box-shadow: 0px 10px 16px 0px
  rgba(132, 132, 152, 0.68);
  opacity: 0.9;
  border-radius: 15px;
  ::v-deep >div:first-child{
    width: 100%!important;
    canvas{
      width: 100%!important;
    }
  }
}
</style>
