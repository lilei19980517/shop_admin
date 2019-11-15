<template>
  <div>
    <div style="margin-top: 15px;" class="search">
      <el-input placeholder="请输入内容" v-model="queryStr" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="queryFn"></el-button>
      </el-input>
    </div>
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
      total: 10,
      queryStr: ""
    };
  },

  methods: {
    getUserList(num) {
      this.$http
        .get("/users", {
          params: {
						pagenum: num || 1,
						pagesize: this.pageSize,
						// 查询
						query: this.queryStr || ''
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
		},
		//查询功能
		queryFn(){
			this.getUserList()
			console.log(123)
		}
  }
};
</script>

<style scoped>
.search {
  width: 300px;
}
</style>