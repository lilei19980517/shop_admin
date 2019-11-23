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
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="mini"
            @click="openEditUser(scope.row)"
          />
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="mini"
            @click="delUser(scope.row.id)"
          />
          <el-button
            type="success"
            icon="el-icon-check"
            plain
            size="mini"
            @click="setRole(scope.row)"
          >分配角色</el-button>
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
        <el-form-item prop="mobile" label="手机" label-width="120px">
          <el-input v-model="userAddForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="userEditDialog">
      <el-form :model="userEditForm" :rules="userEditRules" ref="userEditForm">
        <el-form-item disabled prop="username" label="用户名" label-width="120px">
          <el-input v-model="userEditForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" label-width="120px">
          <el-input v-model="userEditForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机" label-width="120px">
          <el-input v-model="userEditForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
   <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
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
        mobile: ""
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
      },
      // 编辑用户
      userEditDialog: false,
      userEditForm: {
        username: "",
        email: "",
        mobile: "",
        id: ""
      },
      userEditRules: {
        mobile: [
          {
            pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
            message: "手机号吗格式不正确",
            trigger: "blur"
          }
        ]
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色Id值
      selectedRoleId: ''
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
    },
    // 打开编辑用户弹窗
    // data是传入的scope.row
    openEditUser(data) {
      this.userEditDialog = true;
      for (let key in this.userEditForm) {
        this.userEditForm[key] = data[key];
      }
    },
    // 编辑用户
    editUser() {
      this.$refs.userEditForm.validate(valid => {
        if (valid) {
          const { id, email, mobile } = this.userEditForm;
          this.$http
            .put(`/users/${id}`, {
              email,
              mobile
            })
            .then(res => {
              const { data, meta } = res.data;
              if (meta.status === 200) {
                // 更新用户数据
                const editUser = this.userList.find(item => item.id === id);
                editUser.email = data.email;
                editUser.mobile = data.mobile;
                this.userEditDialog = false;
              }
            });
        }
      });
    },
    // 删除用户
    delUser(id) {
      this.$confirm("确认删除该用户吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.delete(`users/${id}`).then(res => {
            const { meta } = res.data;
            this.$message({
              type: "success",
              message: meta.msg
            });
            //裁剪userList
            const index = this.userList.findIndex(item => item.id === id);
            this.userList.splice(index, 1);
            // 如果是最后一页
            const totalPage = Math.ceil(this.userList.length / this.pageSize);
            if (this.curPage > totalPage) {
              this.getUserList(--this.curPage);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
  // 展示分配角色的对话框
    async setRole(userInfo) {
      this.userInfo = userInfo

      // 在展示对话框之前，获取所有角色的列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }

      this.rolesList = res.data

      this.setRoleDialogVisible = true
    },
    // 点击按钮，分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色！')
      }

      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败！')
      }

      this.$message.success('更新角色成功！')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = {}
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