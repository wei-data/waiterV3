<script setup lang="ts">
import { reactive, ref } from 'vue'
import router from "../../../module/router";
import type { FormInstance, FormRules } from 'element-plus'
import request from "../../../module/request";
import {ElMessage} from "element-plus";
const ruleFormRefSign = ref<FormInstance>()
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
// 密码确认验证
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('输入框不能为空'))
  } else if (value !== SignIn.pass) {
    callback(new Error("密码需要保持一致"))
  } else {
    callback()
  }
}
// 注册变量
const SignIn = reactive({
  pass: '',
  checkPass: '',
  uname: '',
})
// 注册时校验
const rulesSign = reactive<FormRules<typeof SignIn>>({
  pass: [{ validator: validatePass, trigger: 'blur' }],
  checkPass: [{ validator: validatePass2, trigger: 'blur' }],
  uname: [{ validator: validatePass, trigger: 'blur' }],
})
// 注册时的提交
const submitFormSign = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async(valid) => {
    if (valid) {
      console.log('submit!')
      const data = await request.post('/users/editpwd', {
        newPwd: SignIn.checkPass
      });
      console.log(data)
      if(data.code === 0){
        ElMessage({
          message: '修改成功，请重新登录',
          type: 'success'
        });
        localStorage.removeItem('token')
        await router.push({
          path: '/lonIn'
        })
      }

    } else {
      console.log('error submit!')
      return false
    }
  })
}
const flag = ref(true)
// 注册时的重置
const resetFormSign = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
};
const Compare = async() =>{
    const data = await request.get('/users/checkoldpwd',{
      params: {
        oldPwd: SignIn.uname
      }
    })
  console.log(data)
  if(data.code==='11'){
    ElMessage({
      type: 'error',
      message: `${data.msg}`
    })
    flag.value = true
  }else {
    ElMessage({
      type: 'success',
      message: `${data.msg}`
    })
      flag.value = false
  }
}
</script>

<template>
  <el-form
      label-position="left"
      style="padding: 0 40px;box-sizing: border-box"
      ref="ruleFormRefSign"
      :model="SignIn"
      status-icon
      :rules="rulesSign"
      label-width="80px"
      class="demo-ruleForm"
  >
    <el-form-item label="原密码" prop="uname">
      <el-input v-model.number="SignIn.uname" @change="Compare" type="password" show-password/>
    </el-form-item>
    <el-form-item label="新密码" prop="pass">
      <el-input v-model="SignIn.pass" :disabled="flag"  type="password" autocomplete="off" show-password/>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPass">
      <el-input
          v-model="SignIn.checkPass"
          :disabled="flag"
          type="password"
          show-password
          autocomplete="off"
      />
    </el-form-item>
    <el-form-item label-width="0">
      <el-button type="primary" @click="submitFormSign(ruleFormRefSign)"
      >修改</el-button
      >
      <el-button @click="resetFormSign(ruleFormRefSign)">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">

</style>
