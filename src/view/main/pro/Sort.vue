<script setup lang="ts">
import {onMounted, reactive, readonly, ref, watch} from "vue";
import request from "../../../module/request";
import {ElMessage} from "element-plus";

const tableData = ref([])
const page = reactive({
  currentPage: 1,
  pageSize: 12
})
const dialogFormVisible = ref(false)

// // 定义一个初始修改之前的数据
const total = ref(0)
// 监听数据变化
watch(page, async ()=>{
  const data = await request.get('/goods/catelist', {
    params: {
      currentPage: page.currentPage,
      pageSize: page.pageSize
    }
  })
  console.log(data)
  data.data.forEach((item:any)=>{
    if(item.state === 0){
      item.state = false
    }else{
      item.state = true
    }
  })
  tableData.value = data.data
  total.value = data.total
},{
  immediate: true,
  deep: true,
  // flush: 'post'
})
const handleCurrentChange = (val: object) => {
  // console.log(val)
  // @ts-ignore
  page.currentPage = val
};
const obj = ref({})
const handleEdit = async (row:any) => {
  row.isEditing = true;
  obj.value = readonly(row)
  console.log(obj.value)
};
const finishEditing = async (row:any) => {
  const data = await request.post('/goods/editcate', {
    id: row.id,
    cateName: row.cateName,
    state: `${row.state}`
  });
  console.log(data)
  if(data.code===0){
    ElMessage({
      message: '修改成功',
      type: 'success'
    })
    row.isEditing = false;
  }else if(data.code === 5001){
    ElMessage({
      message: `${data.code}后端出现问题，请你们测试人员分清楚`,
      type: 'error'
    })
  }
};
const add = reactive({
  state: true,
  cateName: ''
})
const addSort = ()=>{
  dialogFormVisible.value = true
}
const addSuccess =async()=>{
  console.log(add)
  console.log(typeof(add.state))
  dialogFormVisible.value = false
  const data = await request.post('/goods/addcate', {
    cateName: add.cateName,
    state: `${add.state}`
  })
  console.log(data)
  if(data.code === 0){
    total.value = total.value+1
    ElMessage({
      message: '添加成功',
      type: 'success'
    })
  }
}
// onMounted(async()=>{
//   const data = await request.post('goods/addcate', {
//     cateName: '你好',
//     state: 'false'
//   });
//   console.log(data)
// })
const handleDelete = async(row: any) => {
  console.log(row)
  tableData.value = tableData.value.filter((item:any) => item.id !== row.id)
  const data = await request.get('/goods/delcate',{
    params: {
      id: row.id
    }
  })
  if(data.code === 0){
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    total.value = total.value-1
  }else {
    ElMessage({
      type: 'warning',
      message:'删除失败，请重试'
    })
  }
}
</script>

<template>
  <div>
<h3 style="padding: 20px 50px;display: flex;justify-content: space-between" >商品分类 <el-button type="primary" @click="addSort">添加</el-button></h3>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="id" label="序号"/>
    <el-table-column label="分类名称" >
      <template #default="{row}">
        <span v-if="!row.isEditing">{{row.cateName}}</span>
        <el-input v-else v-model="row.cateName" placeholder="Please input" />
      </template>
    </el-table-column>
    <el-table-column label="是否启用" >
      <template #default="{row}">
        <el-switch
            :disabled="!row.isEditing"
            v-model="row.state"
            class="ml-2"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        />
      </template>
    </el-table-column>
    <el-table-column fixed="right" prop="orderState" label="订单状态">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="handleDelete(scope.row)">删除</el-button>
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
  <el-dialog v-model="dialogFormVisible" title="添加商品">
    <el-form :model="add">
      <el-form-item label="分类名称" label-width="100px">
        <el-input v-model="add.cateName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="是否开启" label-width="100px">
        <el-switch
            v-model="add.state"
            class="ml-2"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
        <el-button type="primary" @click="addSuccess">
          确认添加
        </el-button>
      </span>
    </template>
  </el-dialog>
  </div>
</template>

<style scoped lang="scss">

</style>
