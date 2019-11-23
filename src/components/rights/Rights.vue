<template>
  <div>
    <el-table
      ref="singleTable"
      :data="rightsList"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="authName" label="权限名称" width="120"></el-table-column>
      <el-table-column property="path" label="路径" width="120"></el-table-column>
      <el-table-column property="level" label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-else-if="scope.row.level === '1'">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    };
  },
  // 进入页面就获取数据
  created() {
    this.getRightsList();
  },
  methods: {
    async getRightsList() {
      const res = await this.$http.get("/rights/list");
      const { data, meta } = res.data;
      if (meta.status === 200) {
        this.rightsList = data;
        console.log(data)
      }
    }
  }
};
</script>

<style>
</style>