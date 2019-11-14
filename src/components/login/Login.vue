<template>
  <div class="login-root"> 
    <el-row>
      <el-col>
        <el-form
          :model="loginForm"
          :rules="rules"
          ref="loginForm"
          class="loginForm"
          :label-position="labelPosition"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">登录</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 导入axios
import axios from 'axios'

export default {
  data() {
    return {
      labelPosition: "top",
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 16, message: "长度在 3 到 16 个字符", trigger: "blur" }
        ],
        passWord: [
          { required: true, message: "请输入密码", trigger: "change" },
          { min: 3, max: 16, message: "长度在 3 到 16 个字符" }
        ],
      }
    };
  },
  methods: {
    // 登录功能实现
    login() {
      // 接口地址http://localhost:8888/api/private/v1/login
      axios
        .post('http://localhost:8888/api/private/v1/login', this.loginForm)
        .then(res => {
          const { data, meta } = res.data
          console.log(data)
          if(meta.status === 200){
            console.log("登录成功")
            this.$router.push('./home')
          }else {
            // ui库提供的消息提示方法
            this.$message({
              type: 'error',
              message: meta.msg,
              duration: 1000
            })
          }
        })
    },
    submitForm() {
      // validate是ui库提供的验证表单方法
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          alert('submit!')
          this.login()
        }else {
          console.log('error submit!')
        }
      })
    },
    resetForm() {
      // resetFields是ui库提供的清空表单方法
      this.$refs.loginForm.resetFields();
    }
  }
};
</script>

<style>
.login-root{
  position: absolute;
  top: calc((100vh - 300px)/2);
  left: calc((100vw - 380px)/2);
  width: 380px;
  height: 300px;
  background-color: #fff;
  border-radius: 10px;
}
.el-row{
  width: 280px;
  height: 300px;
  margin: auto;
}
</style>