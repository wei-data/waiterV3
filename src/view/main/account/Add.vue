<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import request from "../../../module/request"
import router from "../../../module/router";
import {ElMessage} from "element-plus";
// ref分类
const ruleFormRefLog = ref<FormInstance>()
const uname = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请输入账户.'))
  }
  // 2-6位的名字
  const regExp =/^[\u4e00-\u9fa5a-zA-Z0-9]{2,10}$/
  if (!regExp.test(value)) {
    callback(new Error('请输入2-6位的名字'))
  } else {
    callback()
  }
  callback()
}
// 密码验证
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('密码没有值'))
  } else {
    const regExp =/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$/
    if (!regExp.test(value)) {
      callback(new Error('需要8-16位数值,大小写至少一个'))
    } else {
      callback()
    }
    callback()
  }
}
// 登录变量
const logIn = reactive({
  pass: '',
  uname: '',
  userGroup: ''
});
// 登录时的校验
const rulesLog = reactive<FormRules<typeof logIn>>({
  pass: [{ validator: validatePass, trigger: 'blur' }],
  uname: [{ validator: uname, trigger: 'blur' }],
})

// 登录时的重置
const resetFormLog = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
// 登录时的提交
const submitFormLog = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate( async(valid) => {
    if (valid) {
      console.log('submit!')
      const data= await request.post('/users/add',{
        account: logIn.uname,
        password: logIn.pass,
        userGroup:logIn.userGroup
      })
      console.log(data)
      if(data.code === 0){
        logIn.uname = '';
        logIn.pass = '';
        logIn.userGroup = ''
        ElMessage({
          message: '添加成功',
          type: 'success'
        })
      }
    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>

<template>
  <el-form
      label-position="left"
      style="padding: 0 40px;box-sizing: border-box"
      ref="ruleFormRefLog"
      :model="logIn"
      status-icon
      :rules="rulesLog"
      label-width="80px"
      class="demo-ruleForm"
  >
    <el-form-item label="用户名:" prop="uname">
      <el-input v-model.number="logIn.uname" />
    </el-form-item>
    <el-form-item label="密码:" prop="pass">
      <el-input v-model="logIn.pass" show-password type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item label="用户组:" prop="pass">
      <el-select v-model="logIn.userGroup" class="m-2" placeholder="Select">
        <el-option
            label="超级管理员"
            value="超级管理员"
        />
        <el-option
            label="普通管理员"
            value="普通管理员"
        />
      </el-select>
    </el-form-item>
    <el-form-item label-width="0">
      <el-button type="primary" @click="submitFormLog(ruleFormRefLog)"
      >添加</el-button
      >
      <el-button @click="resetFormLog(ruleFormRefLog)">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">

</style>
