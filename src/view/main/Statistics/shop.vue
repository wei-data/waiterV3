<script setup lang="ts">
import {onMounted, ref} from "vue";
import * as echarts from "echarts";
const box = ref(null)
const value =ref()
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
      text: '堆叠区域图'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"]
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ["周一","周二","周三","周四","周五","周六","周日"]
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Email',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [300,400,500,700,200,400,200]
      },
      {
        name: 'Union Ads',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [300,300,500,400,400,200,100]
      },
      {
        name: 'Video Ads',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [400,200,100,300,300,500,300]
      },
      {
        name: 'Direct',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [300,400,200,500,400,200,100]
      },
      {
        name: 'Search Engine',
        type: 'line',
        stack: 'Total',
        label: {
          show: true,
          position: 'top'
        },
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [300,500,300,700,1200,400,400]
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
</script>

<template>
  <div>
  <h3 style="padding-bottom: 40px">商品统计</h3>
  <el-date-picker
      v-model="value"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
  </el-date-picker>
  <el-button type="primary" style="margin-left: 10px">查询</el-button>
  <div id="box" ref="box" style="width: 100%;height:500px;margin-top: 50px"></div>
  </div>
</template>

<style scoped lang="scss">

</style>
