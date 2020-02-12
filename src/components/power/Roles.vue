<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addRoles">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 角色列表区域 -->
            <el-table :data="rolelist" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <el-row :class="['dbbottom', i1 === 0 ?'dbtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                      <!-- 渲染一级权限 -->
                      <el-col :span="5">
                        <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <!-- 渲染二级三级权限 -->
                      <el-col :span="19">
                        <!-- 通过for循坏嵌套渲染二级权限 -->
                        <el-row :class="[i2 === 0? '': 'dbtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                          <!-- 二级 -->
                          <el-col :span="6">
                            <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                          </el-col>
                          <!-- 三级 -->
                          <el-col :span="18">
                            <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el=icon-edit" @click="openRevise(scope.row.id)">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el=icon-delete" @click="removeRoleById(scope.row.id)">删除</el-button>
                        <el-button size="mini" type="warning" icon="el=icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加角色对话框 -->
        <el-dialog
          title="添加角色"
          :visible.sync="addroles"
          width="50%">
          <el-form :model="roles" :rules="rolesRules" ref="rolesRef" label-width="80px">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="roles.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="roles.roleDesc"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="resetFormAdd">取 消</el-button>
            <el-button type="primary" @click="requestFormAdd">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 编辑角色对话框 -->
         <el-dialog
          title="修改角色"
          :visible.sync="editroles"
          width="50%">
          <el-form :model="editrole" :rules="editRules" ref="editRef" label-width="80px">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="editrole.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="editrole.roleDesc"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="resetFormEdit">取 消</el-button>
            <el-button type="primary" @click="requestFormEdit">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 分配权限的对话框 -->
        <el-dialog
          title="分配权限"
          :visible.sync="setRightDialogVisible"
          width="50%"
          @close="setRightDialogClosed">
          <!-- 树形控件 -->
          <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id"
          default-expand-all :default-checked-keys="defKeys"
          ref="treeRef"></el-tree>
          <span slot="footer" class="dialog-footer">
            <el-button @click="setRightDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
          </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      // 添加角色的对话框的控制
      addroles: false,
      // 添加角色的表单数据
      roles: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      // 添加角色验证规则对象
      rolesRules: {
        roleName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色的描述', trigger: 'blur' }
        ]
      },
      // 添加编辑角色的规则对象
      editRules: {
        roleName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色的描述', trigger: 'blur' }
        ]
      },
      // 编辑角色的信息
      editrole: {},
      // 编辑角色的对话框控制
      editroles: false,
      // 控制展示分配权限对话框显示与隐藏
      setRightDialogVisible: false,
      // 所有权限数据
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中节点的id数组
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolelist = res.data
      // console.log(res.data)
    },
    // 添加角色
    addRoles() {
      this.addroles = true
    },
    // 点击添加角色对话框的取消按钮 重置表单
    resetFormAdd() {
      this.$refs.rolesRef.resetFields()
      // 关闭对话框
      this.addroles = false
    },
    // 点击确定 进行表单验证 通过 发送请求
    requestFormAdd() {
      this.$refs.rolesRef.validate(async valid => {
        // eslint-disable-next-line no-useless-return
        if (!valid) return
        // 发送添加角色信息的数据请求
        const { data: res } = await this.$http.post('roles', this.roles)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }
        // 关闭对话框
        this.addroles = false
        // 刷新数据列表
        this.getRolesList()
        // 提示用户添加角色成功
        this.$message.success('添加角色成功')
      })
    },
    // 点击编辑打开编辑角色对话框
    async openRevise(id) {
      // 根据id查询数据
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色信息失败')
      }
      // 把查询到的角色信息保存到editrole
      this.editrole = res.data
      this.editroles = true
    },
    // 点击编辑角色对话框的取消按钮 重置表单
    resetFormEdit() {
      this.$refs.editRef.resetFields()
      // 关闭对话框
      this.editroles = false
    },
    // 点击确定提交信息
    requestFormEdit() {
      this.$refs.editRef.validate(async valid => {
        // eslint-disable-next-line no-useless-return
        if (!valid) return
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put('roles/' + this.editrole.roleId, {
          roleName: this.editrole.roleName,
          roleDesc: this.editrole.roleDesc
        })
        if (res.meta.status !== 200) {
          return this.$message.error('更新角色信息失败')
        }
        // 关闭对话框
        this.editroles = false
        // 刷新数据列表
        this.getRolesList()
        // 提示修改成功
        this.$message.success('更新角色信息成功')
      })
    },
    // 删除角色
    async removeRoleById(id) {
      // 先弹窗进行提示 是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认删除则返回值为字符串 confirm
      // 如果用户取消删除则返回值为字符串 cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // 确认删除 则发送请求删除用户 并提示用户删除成功
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败')
      }
      this.$message.success('删除角色成功')
      this.getRolesList()
    },
    // 根据id删除对应权限
    async removeRightById(role, rightId) {
      // 弹框提示用户是否删除用户
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      // 发起删除角色权限的请求
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)

      if (res.meta.status !== 200) {
        return this.$messag.error('删除权限失败')
      }

      // 刷新角色列表  this.getRolesList() 一种方式   更好的方式如下： 把服务器返回的数据直接返回到 数组上 而不是通过渲染
      role.children = res.data
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有权限的数据 渲染到页面上
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      // 获取数据成功 把数据保存起来
      this.rightslist = res.data
      // console.log(this.rightslist)

      // 获取三级节点的id
      this.getLeafKeys(role, this.defKeys)

      // 请求后 显示对话框
      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defkeys 这个数组中
    getLeafKeys(node, arr) {
      // 如果当前 node 不包含 children 属性就是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听权限对话框关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击确定分配权限
    async allotRights() {
      const keys =
      [...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]

      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
.dbtop{
  border-top: 1px solid #eee;
}
.dbbottom{
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
