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
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    legend: {
      data:  ["蒸发量", "降水量", "平均温度"]
    },
    xAxis: [
      {
        type: 'category',
        data: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: 'Precipitation',
        min: 0,
        max: 250,
        interval: 50,
        axisLabel: {
          formatter: '{value} ml'
        }
      },
      {
        type: 'value',
        name: 'Temperature',
        min: 0,
        max: 25,
        interval: 5,
        axisLabel: {
          formatter: '{value} °C'
        }
      }
    ],
    series: [
      {
        name: 'Evaporation',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value:string) {
            return value + ' ml'
          }
        },
        data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
      },
      {
        name: 'Precipitation',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value:string) {
            return value + ' ml'
          }
        },
        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 130.6, 182.2, 48.7, 18.8, 6.0, 2.3]
      },
      {
        name: 'Temperature',
        type: 'line',
        yAxisIndex: 1,
        tooltip: {
          valueFormatter: function (value:string) {
            return value + ' °C'
          }
        },
        data:  [2.0, 2.2, 3.3, 6.5,8.3, 15.2, 24.3, 23.4, 15.0, 5.5, 3.0, 2.2]
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
