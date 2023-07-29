<script setup lang="ts">
import {reactive, ref} from "vue";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import request from "../../../module/request"
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'
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

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}
const handSuccess = (val)=>{
  // console.log(val.url)
  ruleForm.imgUrl = val.url
}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      console.log('submit!')
      console.log(ruleForm)
      const data = await request.post('/goods/add',{
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
      // dialogFormVisible.value = false
    } else {
      console.log('error submit!', fields)
    }
  })
}
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<template>
  <div>
  <h3 style="padding: 20px 100px">添加商品</h3>
  <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      style="padding-right: 50%"
      :size="formSize"
      status-icon
  >
    <el-form-item label="商品名称" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>
    <el-form-item label="商品分类" prop="category">
      <el-select v-model="ruleForm.category" placeholder="商品分类">
        <el-option label="超级管理员" value="超级管理员" />
        <el-option label="普通管理员" value="普通管理员" />
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
          action="#"
          :on-change="handSuccess"
          list-type="picture-card"
          :limit="1"
          :auto-upload="false">
        <el-icon><Plus /></el-icon>

        <template #file="{ file }">
          <div>
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
            <span class="el-upload-list__item-actions">
          <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in /></el-icon>
          </span>
        </span>
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
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
  </div>
</template>

<style scoped lang="scss">

</style>
