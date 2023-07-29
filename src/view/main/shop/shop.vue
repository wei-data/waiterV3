<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import type { FormInstance } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps,UploadUserFile } from 'element-plus'
import request from "../../../module/request";



const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  name: '',
  bulletin: '',
  avatar: '',
  deliveryPrice: 0,
  deliveryTime: 0,
  description: '',
  score: 0,
  sellCount: '',
  supports: [],
  // 店铺头像
  pics: [],
  date: [],
  minPrice: '',
  imageUrl: undefined
});

const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
  ruleForm.imageUrl = URL.createObjectURL(uploadFile.raw!)
}
const dialogImageUrl = ref('')

const fileList = ref<UploadUserFile[]>([
]);
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}
// const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  if (uploadFile.url != null) {
    dialogImageUrl.value = uploadFile.url
  }
  dialogVisible.value = true
}
onMounted(async () => {
  const {data} = await request.get('/shop/info')
  console.log(data)
  ruleForm.name = data.name
  ruleForm.bulletin = data.bulletin
  ruleForm.avatar = data.avatar
  ruleForm.deliveryPrice = data.deliveryPrice
  ruleForm.deliveryTime = data.deliveryTime
  ruleForm.description = data.description
  ruleForm.score = data.score
  ruleForm.sellCount = data.sellCount
  ruleForm.supports = data.supports
  ruleForm.date = data.date
  ruleForm.minPrice = data.minPrice
  fileList.value = data.pics;
  let arr: any[] = [];
  data.pics.forEach((item: never) => {
    arr.push({url:item})
  })
  fileList.value = arr
});
const save = async()=>{
  const  data= await request.post('/shop/edit', {
    id: 1,
    name : ruleForm.name,
    bulletin : ruleForm.bulletin,
    avatar : ruleForm.avatar,
    deliveryPrice : ruleForm.deliveryPrice,
    deliveryTime : ruleForm.deliveryTime,
    description : ruleForm.description,
    score : ruleForm.score,
    sellCount : ruleForm.sellCount,
    supports : ruleForm.supports,
    date : ruleForm.date,
    pics : ruleForm.pics
  })
  console.log(data)
}
</script>

<template>
  <div>
  <h3 style="display: flex; justify-content: space-between;padding: 20px 30px">店铺管理 <el-button type="primary" @click="save">保存</el-button></h3>
  <div style="height: 650px;overflow-y: scroll">
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
    >
      <el-form-item label="店铺名称" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="店铺公告" prop="bulletin">
        <el-input v-model="ruleForm.bulletin" type="textarea" style="height: 130px" :rows="4"/>
      </el-form-item>
      <el-form-item label="店铺头像" prop="avatar">
        <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
        >
          <img v-if="ruleForm.avatar" :src="ruleForm.avatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="店铺图片" prop="pics">
        <el-upload
            v-model:file-list="fileList"
            action="/shop/info"
            method="get"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>

        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="配送费" prop="deliveryPrice">
        <el-input-number v-model="ruleForm.deliveryPrice" />
      </el-form-item>
      <el-form-item label="送达时间" prop="deliveryTime">
        <el-input v-model="ruleForm.deliveryTime"></el-input>
      </el-form-item>
      <el-form-item label="配送方式" prop="description">
        <el-select v-model="ruleForm.description" clearable placeholder="Select">
          <el-option label="蜂鸟专送" value="蜂鸟专送"/>
          <el-option label="极兔快递" value="极兔快递"/>
          <el-option label="顺丰快递" value="顺丰快递"/>
        </el-select>
      </el-form-item>
      <el-form-item label="店铺评分" prop="score">
        <el-input-number v-model="ruleForm.score" :min="1" />
      </el-form-item>
      <el-form-item label="销量" prop="sellCount">
        <el-input v-model="ruleForm.sellCount" type="text" />
      </el-form-item>
      <el-form-item label="活动" prop="supports">
        <el-checkbox-group v-model="ruleForm.supports">
          <el-checkbox label="在线支付满28减5" name="type" />
          <el-checkbox label="VC无限橙果汁全场8折" name="type" />
          <el-checkbox label="单人精彩套餐" name="type" />
          <el-checkbox label="特价饮品8折抢购" name="type" />
          <el-checkbox label="单人特色套餐" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="营业时间">
        <el-time-picker
            v-model="ruleForm.date"
            is-range
            range-separator="To"
            start-placeholder="Start time"
            end-placeholder="End time"
        />
      </el-form-item>
    </el-form>
  </div>
  </div>

</template>

<style scoped lang="scss">
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
 .avatar-uploader .el-upload {
   border: 1px dashed var(--el-border-color);
   border-radius: 6px;
   cursor: pointer;
   position: relative;
   overflow: hidden;
   transition: var(--el-transition-duration-fast);
 }

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
