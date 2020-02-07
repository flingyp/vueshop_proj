/* eslint-disable no-useless-return */
<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 登录头像布局 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录表单布局 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        label-width="0px"
        class="login_form"
        :rules="loginFormRules"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 这是登录表单的数据绑定对象 username 用户名  password 密码 Element-UI 规则
      loginForm: {
        username: '',
        password: ''
      },
      // 表单的验证规则对象 Element-UI 规则
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮，进行表单重置
    resetLoginForm () {
      //   console.log(this)
      // 这个this指定是 Login.vue;
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      // 点击登录按钮 进行表单预验证 根据预验证的valid返回的 布尔值 判断是否发送请求
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const reseult = await this.$http.post('login', this.loginForm)
        // console.log(reseult.data)
        // 根据状态码判断是否登录成功 meta里的status是200就是登录成功
        if (reseult.data.meta.status !== 200) {
          return this.$message.error('登录失败')
        }
        this.$message.success('登录成功')
        // 将登录之后的 token 保存到客户端的 sessionStorage 中
        // 项目中出了登录之外的API接口，必须在登录之后才能访问
        // token 只应在网址打开期间有效，使用将 token 保存在 sessionStorage 中
        window.sessionStorage.setItem('token', reseult.data.data.token)
        // 通过编程式导航跳转到后台页面 路由地址是 /home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  // 头部布局  avatar_box
  .avatar_box {
    height: 130px;
    width: 130px;
    position: absolute;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
