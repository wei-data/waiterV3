<script setup lang="ts">
import {onMounted, reactive} from "vue";
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import type { UploadProps } from 'element-plus'

const imageUrl = ref('')
import request from "../../module/request";
interface DataA {
  account: string;
  ctime: string;
  id: number;
  imgUrl: string;
  userGroup: string
}
const Data:DataA = reactive({
  account: '',
  ctime: '',
  id: 0,
  imgUrl: '',
  userGroup: ''
})
onMounted(async()=>{
  const data =await request.get('/users/info')
  Data.account = data.account;
  Data.imgUrl = data.imgUrl;
  Data.id = data.id;
  Data.ctime = data.ctime;
  Data.userGroup = data.userGroup;
})
const beforeUpload=(file)=> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file.raw); // 将文件读取为Data URL

    reader.onload = () => {
      const base64Data = reader.result.split(',')[1]; // 提取base64数据部分
      file.base64Data = base64Data;

      resolve(file); // 将处理后的file对象返回，继续上传
    };
  });
}
const handleSuccess=(response, file)=>  {
  // 上传成功后的处理逻辑
  console.log('上传成功', response, file);
}
const  handleError=(error, file)=>  {
  // 上传失败后的处理逻辑
  console.log('上传失败', error, file);
}
</script>

<template>
  <div>
    <div>
      管理员信息
    </div>
    <el-divider />
    <div>管理员ID: {{Data.id}}</div>
    <el-divider />
    <div>账号: {{Data.account}}</div>
    <el-divider />
    <div>用户组：{{Data.userGroup}}</div>
    <el-divider />
    <div>创建时间: {{Data.ctime}}</div>
    <el-divider />
    <div>管理员头像：
      <el-upload
          class="avatar-uploader"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :show-file-list="false"
          :on-success="handleSuccess"
          :on-error="handleError"
          :before-upload="beforeUpload"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
