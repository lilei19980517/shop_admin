<template>
  <div>
    <el-table :data="userList" stripe>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="mg_state" label="用户状态"></el-table-column>
      <el-table-column prop label="操作"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="curPage"
      @current-change="changePage"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList(1);
  },
  data() {
    return {
      userList: [],
      pageSize: 3,
      curPage: 1,
      total: 10
    };
  },

  methods: {
    getUserList(num) {
      this.$http
        .get("/users", {
          params: {
            pagenum: num,
            pagesize: this.pageSize
          },
          headers: {
            Authorization: localStorage.getItem("token")
          }
        })
        .then(res => {
          const { data, meta } = res.data;
          if (meta.status === 200) {
            console.log(data);
            this.userList = data.users;
            this.total = data.total;
          }
        });
    },
    // ui库提供的分页点击页码事件
    changePage(curPage) {
      this.getUserList(curPage);
    }
  }
};
</script>

<style scoped>
</style>