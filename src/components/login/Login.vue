<template>
  <div>
    <el-form
      :model="loginForm"
      :rules="rules"
      ref="loginForm"
      class="loginForm"
      :label-position="labelPosition"
    >
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="loginForm.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="passWord">
        <el-input v-model="loginForm.passWord"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">登录</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelPosition: "top",
      loginForm: {
        userName: "",
        passWord: ""
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" }
        ],
        passWord: [
          { required: true, message: "请输入密码", trigger: "change" },
          { min: 8, max: 16, message: "长度在 8 到 16 个字符" }
        ],
      }
    };
  },
  methods: {
    submitForm() {
      // validate是ui库提供的验证表单方法
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          alert('submit!')
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
</style>