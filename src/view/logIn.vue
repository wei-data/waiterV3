<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import request from "../module/request"
import router from "../module/router";
import {ElMessage} from "element-plus";
// 开关按钮
const flag = ref(true)
// ref分类
const ruleFormRefLog = ref<FormInstance>()
const ruleFormRefSign = ref<FormInstance>()
// 账户验证
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
// 登录变量
const logIn = reactive({
  pass: '',
  uname: '',
})
// 注册时校验
const rulesSign = reactive<FormRules<typeof SignIn>>({
  pass: [{ validator: validatePass, trigger: 'blur' }],
  checkPass: [{ validator: validatePass2, trigger: 'blur' }],
  uname: [{ validator: uname, trigger: 'blur' }],
})
// 登录时的校验
const rulesLog = reactive<FormRules<typeof SignIn>>({
  pass: [{ validator: validatePass, trigger: 'blur' }],
  checkPass: [{ validator: validatePass2, trigger: 'blur' }],
  uname: [{ validator: uname, trigger: 'blur' }],
})
// 登录时的提交
const submitFormLog = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate( async(valid) => {
    if (valid) {
      console.log('submit!')
      const data= await request.post('/users/checkLogin',{
        account: logIn.uname,
        password: logIn.pass
      })
      console.log(data)
      if(data.code === 0){
        localStorage.setItem('token', data.token)
        router.push({
          path: '/Main/Index'
        }).then()
      }
    } else {
      console.log('error submit!')
      return false
    }
  })
}
// 注册时的提交
const submitFormSign = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      console.log('submit!')
      try {
         await request.post('/users/add',{
          account: SignIn.uname,
          password: SignIn.pass,
          userGroup:'未定义'
        })
        ElMessage({
          type: 'success',
          message: '创建成功'
        })
      }catch(err){
        ElMessage({
          type: 'error',
          message: `对不起，我们平台还未开发自行注册，需要管理员进行创建${err}`
        })
      }
    } else {
      console.log('error submit!')
      return false
    }
  })
}
// 登录时的重置
const resetFormLog = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
// 注册时的重置
const resetFormSign = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
const sign =() =>{
  flag.value= false
}
const log =() =>{
  flag.value = true
}
</script>

<template>
<div id="logIn">
 <div id="form">
   <h2 style="width: 100%;text-align: center; font-family: 楷体;color: #e15e0d;padding: 20px 0">欢迎来到店小二，请登录预览更多</h2>
   <el-form
       label-position="left"
       style="padding: 0 40px;box-sizing: border-box"
       v-if="flag"
       ref="ruleFormRefLog"
       :model="logIn"
       status-icon
       :rules="rulesLog"
       label-width="80px"
       class="demo-ruleForm"
   >
     <el-form-item label="uname:" prop="uname">
       <el-input v-model.number="logIn.uname" />
     </el-form-item>
     <el-form-item label="Password:" prop="pass">
       <el-input v-model="logIn.pass" type="password" autocomplete="off" />
     </el-form-item>
     <el-form-item label-width="0">
       <el-button type="primary" @click="submitFormLog(ruleFormRefLog)"
       >登录</el-button
       >
       <el-button @click="resetFormLog(ruleFormRefLog)">重置</el-button>
       <el-button link type="warning" @click="sign">注册</el-button>
     </el-form-item>
   </el-form>
   <el-form
       label-position="left"
       style="padding: 0 40px;box-sizing: border-box"
       ref="ruleFormRefSign"
       v-else
       :model="SignIn"
       status-icon
       :rules="rulesSign"
       label-width="80px"
       class="demo-ruleForm"
   >
     <el-form-item label="uname" prop="uname">
       <el-input v-model.number="SignIn.uname" />
     </el-form-item>
     <el-form-item label="Password" prop="pass">
       <el-input show-password v-model="SignIn.pass" type="password" autocomplete="off" />
     </el-form-item>
     <el-form-item label="Confirm" prop="checkPass">
       <el-input
           v-model="SignIn.checkPass"
           type="password"
           show-password
           autocomplete="off"
       />
     </el-form-item>
     <el-form-item label-width="0">
       <el-button type="primary" @click="submitFormSign(ruleFormRefSign)"
       >注册</el-button
       >
       <el-button @click="resetFormSign(ruleFormRefSign)">重置</el-button>
       <el-button type="warning" link @click="log">登录</el-button>
     </el-form-item>
   </el-form>
 </div>
</div>
</template>

<style scoped lang="scss">
#logIn {
  height: 100vh;
  width: 100vw;
  background-image: url('../assets/bg.png');
  background-size: 100% 100%;
  #form {
    //height: 300px;
    width: 500px;
    border-radius: 20px;
    opacity: .7;
    background: white;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -150px;
    margin-left: -250px;

    ::v-deep .el-form-item__content {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
