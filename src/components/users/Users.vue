<template>
  <div>
    <el-table :data="userList" stripe>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="mg_state" label="用户状态"></el-table-column>
      <el-table-column prop="" label="操作"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList();
  },
  data() {
    return {
      userList: []
    };
  },

  methods: {
    getUserList() {
      this.$http
        .get("/users", {
          params: {
            pagenum: 1,
            pagesize: 3
          },
          headers: {
            Authorization: localStorage.getItem("token")
          }
        })
        .then(res => {
          const { data, meta } = res.data;
          if (meta.status === 200) {
              console.log(data)
            this.userList = data.users;
          }
        });
    }
  }
};
</script>

<style scoped>
</style>