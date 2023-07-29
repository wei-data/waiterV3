<script setup lang="ts">
import {reactive,watch, ref} from 'vue'
import request from "../../../module/request";
import {ElMessage} from "element-plus";
import type { FormInstance, FormRules , UploadInstance } from 'element-plus'
const parentBorder = ref(false)

// 每页显示的条数
const page = reactive({
  pageSize: 5,
  currentPage: 1,
})
const total = ref(0)
// interface User {
//   name: string
//   category: string;
// }
const upload = ref<UploadInstance>()
const dialogFormVisible = ref(false)

const tableData = ref([])
interface RuleForm {
  name: string
  category: string
  price: number
  imgUrl: string
  goodsDesc: string
  id: number
}

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  name: '',
  category: '',
  price: 0,
  imgUrl: '',
  goodsDesc: '',
  id: 0
})

const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 1, max: 15, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  goodsDesc: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' }
  ]
})
const handleEdit = (index: number, row: any) => {
  console.log(index, row)
  ruleForm.id = row.id
  dialogFormVisible.value = true
}
const handleDelete = async(index: number, row: any) => {
  console.log(index, row)
  // console.log(tableData.value)
   tableData.value = tableData.value.filter((item:any) => item.id !== row.id)
  const data = await request.get('/goods/del',{
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
const handleCurrentChange = (val: object)=> {
  // console.log(val)
  // @ts-ignore
  page.currentPage = val
}
// 监听数据变化
watch(page, async ()=>{
  const data = await request.get('/goods/list', {
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
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      console.log('submit!')
      console.log(ruleForm)
      const data = await request.post('/goods/edit',{
        name: ruleForm.name,
        category: ruleForm.category,
        price: ruleForm.price,
        imgUrl: ruleForm.imgUrl,
        goodsDesc: ruleForm.goodsDesc,
        id: ruleForm.id
      })
      console.log(data)
      if(data.code === 0) {
        // 1.0下面可以实现修改之后就是当前项的修改成功
        // tableData.value.some((item:any)=>{
        //   if(item.id === ruleForm.id){
        //     item.name = ruleForm.name;
        //     item.category = ruleForm.category;
        //     item.price = ruleForm.price;
        //     item.imgUrl = ruleForm.imgUrl;
        //     item.goodsDesc = ruleForm.goodsDesc
        //     return true
        //   }
        // })
        const data = await request.get('/goods/list', {
          params: {
            currentPage: page.currentPage,
            pageSize: page.pageSize
          }
        })
        tableData.value = data.data
        total.value = data.total
        // 1.1 修改之后把修改好的数据截取，并且添加到数据的第一位
        // 存储需要修改的对象
        //   const obj:any = tableData.value.find((item:any) =>item.id === ruleForm.id)
        //   // obj[0]
        //       obj.name= ruleForm.name,
        //       obj.category= ruleForm.category,
        //       obj.price= ruleForm.price,
        //       obj.imgUrl= ruleForm.imgUrl,
        //       obj.goodsDesc= ruleForm.goodsDesc,
        //       // console.log(obj)
        //   tableData.value =  tableData.value.filter((item:any)=>item.id !== ruleForm.id)
        //   // console.log(tableData.value)
        //   tableData.value.unshift(obj)
        ElMessage({
          type: 'success',
          message: '修改成功'
        })
      }
      dialogFormVisible.value = false
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
const handChange = (files:any)=>{
  // console.log(files)
  ruleForm.imgUrl = files.name
}

</script>

<template>
  <div>
    <el-table :data="tableData" :border="parentBorder" style="width: 100%">
      <el-table-column type="expand">
        <template #default="{row}">
          <el-descriptions
              style="padding: 0 80px"
              :column="2"
              title="商品信息">
            <el-descriptions-item label="商品ID">{{ row.id }}</el-descriptions-item>
            <el-descriptions-item label="商品名称">{{ row.name }}</el-descriptions-item>
            <el-descriptions-item label="所属分类">{{ row.category }}</el-descriptions-item>
            <el-descriptions-item label="商品价格">{{row.price}}</el-descriptions-item>
            <el-descriptions-item label="商品图片" >
              {{row.price}}
<!--              <template #default="{ row }">-->
<!--                <div>000</div>-->
<!--/*                <el-image style="width: 50px; height: 50px" :src="row.imageUrl"></el-image>*/-->
<!--              </template>-->
            </el-descriptions-item>
            <el-descriptions-item label="商品时间">{{row.ctime}}</el-descriptions-item>
            <el-descriptions-item label="商品评价">{{row.rating}}</el-descriptions-item>
            <el-descriptions-item label="商品销量">{{row.sellCount}}</el-descriptions-item>
            <el-descriptions-item label="商品描述">{{row.goodsDesc}}</el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="name" />
      <el-table-column label="所属分类" prop="category" />
      <el-table-column label="商品价格" prop="price" />
      <el-table-column label="商品图片">
<!--        <template #default="scope">-->
<!--          <img :src="scope.row.imgUrl" alt="">-->
<!--        </template>-->
        <template #default="{ row }">
          <el-image style="width: 60px; height: 60px" :src="row.imgUrl" fit="fill" />
        </template>
      </el-table-column>
      <el-table-column label="商品描述" prop="goodsDesc" />
      <el-table-column label="Operations">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button
          >
          <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button >
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
    <el-dialog v-model="dialogFormVisible" title="Shipping address">
      <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="商品分类" prop="category">
          <el-select v-model="ruleForm.category" placeholder="商品分类">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input-number
              v-model="ruleForm.price"
              class="mx-4"
              :min="1"
              :max="10000"
              controls-position="right"
          />
        </el-form-item>
        <el-form-item label="Activity time">
          <el-upload
              ref="upload"
              class="upload-demo"
              :limit="1"
              :on-change="handChange"
              :auto-upload="false"
          >
            <template #trigger>
              <el-button type="primary">点击上传图片</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip text-red">
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品备注" prop="goodsDesc">
          <el-input v-model="ruleForm.goodsDesc" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            提交
          </el-button>
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">

</style>
