<script setup lang="ts">
// import { formatDistance, subDays } from 'date-fns'
import {reactive, ref, watch} from 'vue'
// import useStore from '../../../module/store/Order.ts';
import request from "../../../module/request";
import {ElMessage} from 'element-plus'
// const store = useStore()
// store.request()
// console.log(store.orderList)
let tableData = ref([])
const drawer = ref(false)
let message = ref({
  consignee: '',
  deliverAddress: '',
  deliveryTime: "",
  orderAmount: '',
  orderNo: '',
  orderState: '',
  phone: '',
  remarks: '',
  orderTime:''
})
// 搜索数据
const formInline:any = reactive({
  OrderNo: '',
  consignee: '',
  phone: '',
  orderState: '',
  date: '',
})
// 每页显示的条数
const page = reactive({
  pageSize: 8,
  currentPage: 1,
})
const total = ref(0)
// watch(())
const submitForm = async (formInline: any) => {
  // console.log(formInline)
  if (formInline.OrderNumber === '' && formInline.user === '' && formInline.CellPhone === '' && formInline.state === '' && formInline.time === '') {
    ElMessage({
      message: '请输入查询的数据',
      type: 'error'
    })
    return;
  }
  const data = await request.get('/order/search',{
    params:{
      orderNo: formInline.OrderNo,
      consignee: formInline.consignee,
      phone: formInline.phone,
      orderState: formInline.orderState,
      date: formInline.date,
      currentPage: page.currentPage,
      pageSize: page.pageSize
    }
  })
  // console.log(data)
  tableData.value = data.data
  total.value = data.total
  console.log('submit!')

}
// 监听数据变化
watch(page, async ()=>{
  const data = await request.get('/order/list', {
    params: {
      currentPage: page.currentPage,
      pageSize: page.pageSize
    }
  })
  tableData.value = data.data
  total.value = data.total
},{
  immediate: true,
  deep: true,
  // flush: 'post'
})
// 查看消息
const handleInquire = async(row:object) => {
  const {data} = await request.get('/order/detail', {
    params: {
      id: row.id
    }
  });
  drawer.value = true
  message.value = data
  // console.log(message)
}
// 修改
const handleEdit = async(row:any)=>{
  // console.log(row)
  row.isEditing = true;
}
const handleCurrentChange = (val: object)=> {
  // console.log(val)
  page.currentPage = val
}
const finishEditing = async (row:any) => {
  row.isEditing = false;
  const data = await request.post('/order/edit',{
    id: row.id,
    consignee: row.consignee,
    deliverAddress: row.deliverAddress,
    deliveryTime: row.deliveryTime,
    orderAmount: row.orderAmount,
    orderNo: row.orderNo,
    orderState: row.orderState,
    phone: row.phone,
    remarks: row.remarks,
    orderTime:row.orderTime
  })
  // console.log(data)
  if(data.code===0){
    ElMessage({
      message: '修改成功',
      type: 'success'
    })
  }else{
    ElMessage({
      message: '修改未能成功，请正确操作',
      type: 'error'
    })
  }
};
</script>

<template>
  <div>
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item label="订单号">
      <el-input v-model="formInline.OrderNo" placeholder="订单号"  />
    </el-form-item>
    <el-form-item label="收货人">
      <el-input v-model="formInline.consignee" placeholder="收货人姓名"  />
    </el-form-item>
    <el-form-item label="手机号">
      <el-input v-model="formInline.phone" placeholder="手机号"  />
    </el-form-item>
    <el-form-item label="订单状态">
      <el-select
          v-model="formInline.orderState"
          placeholder="Activity zone"
          clearable
      >
        <el-option label="已受理" value="已受理" />
        <el-option label="派送中" value="派送中" />
        <el-option label="已完成" value="已完成" />
      </el-select>
    </el-form-item>
    <el-form-item label="选择时间">
      <el-date-picker
          v-model="formInline.date"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="Pick a date"
          clearable
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(formInline)">查询</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="orderNo" label="订单号" width="200" />
    <el-table-column prop="orderTime" label="下单时间" width="200" />
    <el-table-column label="手机号" width="200" >
      <template #default="{row}">
        <span v-if="!row.isEditing">{{row.phone}}</span>
        <el-input v-else v-model="row.phone" placeholder="Please input" />
      </template>
    </el-table-column>
    <el-table-column  label="收货人" width="200" >
      <template #default="{row}">
        <span v-if="!row.isEditing">{{row.consignee}}</span>
        <el-input v-else v-model="row.consignee" placeholder="Please input" />
      </template>
    </el-table-column>
    <el-table-column prop="deliverAddress" label="配送地址" width="200" >
      <template #default="{row}">
        <span v-if="!row.isEditing">{{row.deliverAddress}}</span>
        <el-input v-else v-model="row.deliverAddress" placeholder="Please input" />
      </template>
    </el-table-column>
    <el-table-column prop="deliveryTime" label="送达时间" width="200" />
    <el-table-column prop="remarks" label="用户备注" width="200" >
      <template #default="{row}">
        <span v-if="!row.isEditing">{{row.remarks}}</span>
        <el-input v-else v-model="row.remarks" placeholder="Please input" />
      </template>
    </el-table-column>
    <el-table-column prop="orderAmount" label="订单金额" width="200" />
    <el-table-column fixed="right" prop="orderState" label="订单状态" width="200">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="handleInquire(scope.row)"
        >查看</el-button
        >
        <el-button v-if="scope.row.isEditing" type="danger" link icon="el-icon-check" @click="finishEditing(scope.row)">确认</el-button>
        <el-button v-else link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
      style="display: flex;justify-content: center;margin: 20px 0"
      background
      layout="total, prev, pager, next,jumper"
      :page-size="page.pageSize"
      :total="total"
      @update:current-page="page.currentPage"
      @current-change="handleCurrentChange"
      class="mt-4"
  />
<!--  详细信息抽屉-->
  <el-drawer v-model="drawer" title="I am the title" :with-header="false">
    <h3 style="text-align: center">个人信息</h3>
    <el-descriptions title="详细信息" :column="1" border>
      <el-descriptions-item
          label="收货人"
          label-align="right"
          align="center"
          label-class-name="my-label"
          class-name="my-content"
          width="150px"
      >{{ message.consignee }}</el-descriptions-item
      >
      <el-descriptions-item label="手机号" label-align="right" align="center"
      >{{ message.phone }}</el-descriptions-item
      >
      <el-descriptions-item label="收获地址" label-align="right" align="center"
      >{{ message.deliverAddress }}</el-descriptions-item
      >
      <el-descriptions-item label="订单金额" label-align="right" align="center"
      >{{ message.orderAmount }}￥</el-descriptions-item
      >
      <el-descriptions-item label="订单状态" label-align="right" align="center"
      >{{ message.orderState }}</el-descriptions-item
      >
      <el-descriptions-item label="下单时间" label-align="right" align="center"
      >{{ message.orderTime }}</el-descriptions-item
      >
      <el-descriptions-item label="送达时间" label-align="right" align="center">
        {{ message.deliveryTime }}
      </el-descriptions-item>
      <el-descriptions-item label="备注" label-align="right" align="center"
      >{{ message.remarks }}</el-descriptions-item
      >
    </el-descriptions>
  </el-drawer>
  </div>
</template>

<style scoped lang="scss">
::v-deep.el-table tr{
  height: 70px!important;
}
.my-label {
  background: var(--el-color-success-light-9);
}
.my-content {
  background: var(--el-color-danger-light-9);
}
</style>
