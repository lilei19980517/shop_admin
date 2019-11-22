<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="search">
      <el-input placeholder="请输入内容" v-model="queryStr" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="queryFn"></el-button>
      </el-input>
      <el-button class="add" type="success" plain @click="showUserAddDialog">添加用户</el-button>
    </div>
    <el-table :data="userList" stripe>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="mg_state" label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ccc"
            @change="userValueChange(scope.row.id,scope.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop label="操作" min-width="270px">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size="mini" />
          <el-button type="danger" icon="el-icon-delete" plain size="mini" />
          <el-button type="success" icon="el-icon-check" plain size="mini">分配角色</el-button>
        </template>
      </el-table-column>
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
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="userAddDialog">
      <el-form :model="userAddForm" :rules="userAddRules" ref="userAddForm">
        <el-form-item prop="username" label="用户名" label-width="120px">
          <el-input v-model="userAddForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" label-width="120px">
          <el-input v-model="userAddForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" label-width="120px">
          <el-input v-model="userAddForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="moble" label="手机" label-width="120px">
          <el-input v-model="userAddForm.moble" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
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
      queryStr: "",
      // 控制用户添加对话框的展示和隐藏
      userAddDialog: false,
      userAddForm: {
        username: "",
        password: "",
        email: "",
        moble: ""
      },
      //添加用户对话框
      userAddRules: {
        username: [
          { required: true, message: "用户名为必填项", trigger: "blur" },
          { min: 3, max: 6, message: "用户名长度在3到6个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码为必填项", trigger: "blur" },
          { min: 3, max: 6, message: "密码长度在3到6个字符", trigger: "blur" }
        ]
      }
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
            query: this.queryStr || ""
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
            this.userValue = data.mg_state;
            this.total = data.total;
          }
        });
    },
    // ui库提供的分页点击页码事件
    changePage(curPage) {
      this.getUserList(curPage);
    },
    //查询功能
    queryFn() {
      this.getUserList();
      console.log(123);
    },
    // 状态改变
    userValueChange(id, curState) {
      this.$http.put(`./users/${id}/state/${curState}`).then(res => {
        this.$message({
          type: "success",
          message: res.data.data.mg_state === 0 ? "禁用成功" : "启动成功",
          duration: 1500
        });
      });
    },
    // 展示用户添加对话框
    showUserAddDialog() {
      this.userAddDialog = true;
    },
    // 添加用户
    addUser() {
      this.$refs.userAddForm.validate(valid => {
        if (valid) {
          // 成功
          this.$http.post("/users", this.userAddForm).then(res => {
            const { meta } = res.data;
            if (meta.status === 201) {
              // 1 关闭对话框
              // 2 重置表单(只要关闭对话框，就会自动触发对话框的关闭事件来重置表单)
              this.userAddDialog = false;

              // 3 重新获取列表数据
              this.getUserList();
              // this.curPage = 1
            }
          });
        } else {
          // 失败
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.el-breadcrumb {
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding-left: 15px;
  background-color: #cfcccc;
}
.search {
  width: 400px;
  display: flex;
}
.add {
  font-weight: 560;
  font-size: 16px;
  color: #678796;
}
</style>