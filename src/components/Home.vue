<template>
    <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header>
        <div>
          <span>电 商 后 台 管 理 系 统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>

      <!-- 页面体区域 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF"
          unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
            <!-- 一级菜单 -->
            <el-submenu v-for="item in menuList" :key="item.id" :index="item.id + ''">
              <!-- 一级菜单的模板区域 -->
              <template slot="title">
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index=" '/' + subItem.path + ''" v-for="subItem in item.children" :key="subItem.id"
              @click="saveNavState('/' + subItem.path)">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>

        <!-- 右边主体区域 -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      // 是否折叠
      isCollapse: false,
      // 激活的链接地址
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // getMenuList 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      // console.log(res)
    },
    // 点击按钮切换菜单的折叠和展开功能
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
// el-header指头部区域  el-aside 侧边栏   el-main 主体区域   Element-ui的规定 标签名就是类名
.home-container{
  height: 100%;
}
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ddd;
  font-size: 20px;
}
.el-aside{
  background-color: #333744;
  .el-menu{
    border-right: 0;
  }
}
.el-main{
  background-color: #EAEDF1;
}
.toggle-button{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color:#fff;
  text-align:center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
