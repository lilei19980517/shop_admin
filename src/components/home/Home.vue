<template>
  <div class="home-root">
    <el-container>
      <el-header>
        <h1>电商后台管理</h1>
        <div>
          <span>欢迎您！后台管理员</span>
          <a href="#" @click.prevent="quit">退出</a>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!-- 下面的el-menu的方法，ui库自带的，用不到会报错 -->
            <!-- @open="handleOpen" -->
            <!-- @close="handleClose" -->
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#4f555a"
            text-color="#fff"
            :router="true"
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/home/users">
                  <i class="el-icon-menu"></i>
                  <span>用户列表</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="2-1">
                  <i class="el-icon-menu"></i>
                  <span>用户列表</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <!-- 子路由出口 -->
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  methods: {
    quit() {
      // 弹出确认对话框
      this.$confirm("您确认退出吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        // 点击确认清除locastroaga
        localStorage.removeItem("token");
        // 跳回登陆页面
        this.$router.push("/login");
      });
    }
  }
};
</script>

<style scoped lang="less">
.home-root {
  height: 100%;
  min-width: 850px;
  min-height: 500px;
  .el-container {
    height: 100%;
    .el-header {
      background-color: #a8bfd3;
      color: #333;
      text-align: center;
      line-height: 100%;
      display: flex;
      justify-content: space-between;
      div {
        width: 300px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          font-size: 20px;
        }
        a {
          font-size: 18px;
          font-weight: 610;
          text-decoration: none;
        }
      }
      h1 {
        flex: 1;
        align-self: center;
        margin-right: -300px;
      }
    }

    .el-aside {
      background-color: #4f555a;
      color: #333;
      text-align: center;
      line-height: 200px;
    }

    .el-main {
      background-color: #e9eef3;
      color: #333;
      text-align: center;
    }
  }
}
</style>