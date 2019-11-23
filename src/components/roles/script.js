export default {
  data() {
    return {
      rolesList: [],
      // 修改对话框属性
      roleEditForm: {
        id: -1,
        roleName: "",
        roleDesc: ""
      },
      roleEditDialog: false,
      // 分配权限
      showRightsDialog: false,
      rightsTree: [],
      defaultProps: {
        // 用来指定使用哪个属性指定子节点
        children: 'children',
        // 用来指定使用数据中哪个属性展示树形解构中每个节点的名字
        label: 'authName'
      },
      // 当前分配权限的id
      curRoleId: -1,
    }
  },
  created() {
    this.getRolesList()
    this.getAllRightsTree()
  },
  methods: {
    // 获取角色列表数据
    async getRolesList() {
      const res = await this.$http.get('/roles')
      this.rolesList = res.data.data
    },
    // 打开修改
    showRoleEditDailog(data) {
      console.log(data)
      this.roleEditDialog = true
      // 获取当前角色的数据
      for (let key in this.roleEditForm) {
        this.roleEditForm[key] = data[key]
      }
    },
    // 发送请求修改
    async editRole() {
      const { id, roleName, roleDesc } = this.roleEditForm
      const res = await this.$http.put(`/roles/${id}`, {
        roleName,
        roleDesc
      })
      const { data, meta } = res.data
      if (meta.status === 200) {
        // 关闭弹窗
        this.roleEditDialog = false
        // 更新列表
        const editRole = this.rolesList.find(item => item.id === id)
        editRole.roleName = data.roleName
        editRole.roleDesc = data.roleDesc
      }
    },
    // 删除角色
    async delRolesById(id) {
      try {
        await this.$confirm('确定删除该角色吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.$http.delete(`/roles/${id}`)
        if (res.data.meta.status === 200) {
          const index = this.rolesList.findIndex(irem => DataTransferItem.id === id)
          this.rolesList.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
      } catch (err) {
        console.log(err)
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      }
    },
    /**
     * 删除权限
     * @param {number} roleId 角色id
     * @param {number} rightId 权限id
     */
    async delRoleRightsById(roleId, rightId) {
      const res = await this.$http.delete(`roles/${roleId}/rights/${rightId}`)
      const { data, meta } = res.data
      if (meta.status === 200) {
        const curRole = this.rolesList.find(item => item.id === roleId)
        curRole.children = data
      }
    },
    // 打开分配权限
    openRightsDialog(curRoleRights, id) {
      // 赋值存储当前选中的id
      this.curRoleId = id
      // 展示对话框
      this.showRightsDialog = true
      this.$nextTick(() => {
        const level3Ids = []
        curRoleRights.forEach(level1 => {
          level1.children.forEach(level2 => {
            level2.children.forEach(level3 => {
              level3Ids.push(level3.id)
            })
          })
        })
        this.$refs.rightsTree.setCheckedKeys(level3Ids)
      })
    },
    // 请求分配权限
    async assignRights() {
      // 全选项
      const checkedKeys = this.$refs.rightsTree.getCheckedKeys()
      // 半选项
      const halfCheckedKeys = this.$refs.rightsTree.getHalfCheckedKeys()
      // 全选项和半选项合并到一起
      const allCheckedIds = [...checkedKeys, ...halfCheckedKeys]
      const res = await this.$http.post(`roles/${this.curRoleId}/rights`, {
        rids: allCheckedIds.join(',')
      })
      if (res.data.meta.status === 200) {
        this.showRightsDialog = false
        this.getRolesList()
      }
    },
    // 获取权限的数据
    async getAllRightsTree() {
      const res = await this.$http.get(`/rights/tree`)
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.rightsTree = data
      }
    }
  }
}