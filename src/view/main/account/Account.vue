<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {ElMessage, ElTable} from 'element-plus'
import request from "../../../module/request";

interface User {
  account: string
  ctime: string
  imgUrl: string
  userGroup: string
  id?: number
}
let ids:Array<number> = reactive([])
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<User[]>([])
const handleSelectionChange = (val: User[]) => {
  console.log(val)
  const arr:Array<number> = []
  val.forEach((item:obj)=>{
    arr.push(item.id)
  })
  ids = arr
  console.log(ids)
  multipleSelection.value = val
}
// interface p {
//   currentPage:number |string,
//   pageSize:number | string
// }
// const page:p = reactive({
//   currentPage: 1,
//   pageSize: 5
// })
// let dataA: User[] = [];
// let tableData = ref(dataA);
const tableData = ref()
onMounted(async()=>{
const data = await request.get('/users/list',{
 params:{
   currentPage:1,
   pageSize:5,
 }
})
  console.log(data)
  tableData.value = data.data
})
// const edit:User = reactive({
//   account: '',
//   userGroup: '',
//   id: 0
// })
const toggleSelection = (rows?: User[]) => {
  if (rows) {
    rows.forEach((row) => {
      // TODO: improvement typing when refactor table
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      multipleTableRef.value!.toggleRowSelection(row, undefined)
    })
  } else {
    multipleTableRef.value!.clearSelection()
  }
}
const batch = async()=>{
  // console.log('['`${ids}`])
  const data = await request.get('/users/batchdel', {
    params: {
      ids: '['+`${ids}`+']'
    }
  });
  console.log(data)
  if(data.code===0){
    ids.forEach((idA:number)=>{
      tableData.value = tableData.value.filter((item:object)=>item.id!==idA)
    })
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
  }
}
const handleClick = async(row:any) => {
  console.log(row)
  const data = await request.get('/users/del',{
    params:{
      id:  row.id
    }
  })
  console.log(data)
  if(data.code === 0){
    tableData.value = tableData.value.filter((item: never)=>item.id!==row.id)
  }
}
const Edit = (row: any) => {
  // edit = row
  row.isEditing = true;
};
const finishEditing=async(row:any)=>{
  const data = await request.post('/users/edit',{
    id: row.id,
    account: row.account,
    userGroup:row.userGroup
  })
  // console.log(data)
  if(data.code===0) {
    ElMessage({
      message: '修改成功',
      type: 'success'
    })
  }
  row.isEditing = false
}
</script>

<template>
  <div>
  <h3 style="border-bottom: 1px solid #cccccc;padding-bottom: 10px">账户列表</h3>
  <el-table
      ref="multipleTableRef"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" />
    <el-table-column label="账号">
      <template #default="{row}">
        <span v-if="!row.isEditing">{{row.account}}</span>
        <el-input v-else v-model="row.account" /></template>
    </el-table-column>
    <el-table-column property="userGroup" label="用户组" >
      <template #default="{row}">
        <span v-if="!row.isEditing">{{row.userGroup}}</span>
        <el-input v-else v-model="row.userGroup" /></template>
    </el-table-column>
    <el-table-column property="ctime" label="创建时间" ></el-table-column>
    <el-table-column fixed="right" label="操作" width="120">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="handleClick(scope.row)"
        >Detail</el-button>
        <el-button v-if="scope.row.isEditing" type="danger" link icon="el-icon-check" @click="finishEditing(scope.row)">确认</el-button>
        <el-button v-else link type="primary" size="small" @click="Edit(scope.row)">Edit</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-button @click="toggleSelection()">清空选项</el-button>
  <el-button @click="batch">批量删除</el-button>
  </div>
</template>

<style scoped lang="scss">

</style>
