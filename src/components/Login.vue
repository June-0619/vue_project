<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0" class="login_form">
        <!-- 用户名-->
        <el-form-item prop="username">
          <!-- 给输入框添加前置小图标-->
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码-->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default{
  data(){
    return{
      //登录表单的数据绑定对象
      loginForm:{
        username:'admin',//默认信息
        password:'123456'
      },
      //登录表单的验证规则对象
      loginFormRules:{
        username:[
           { required: true, message: '请输入用户名称', trigger: 'blur' },/* trigger表示触发时机 */
           { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  methods:{
    resetLoginForm(){
      // console.log(this);
      this.$refs.loginFormRef.resetFields();
    },
    login(){
      this.$refs.loginFormRef.validate(async valid=>{/* validate接受回调函数，返回一个布尔值，valid为形参,即该布尔值 */
        if(!valid) return; //如果失败直接返回，不提交数据
        /* 将返回数据中的data属性取出，将data重命名为res对象*/
        const {data:res}=await this.$http.post('login',this.loginForm);/* 由于返回的对象为promise,所以可以简化为async await操作 */
        if(res.meta.status!==200){
          return this.$message.error('登录失败')
        }
        this.$message.success('登录成功')
        console.log(res);
        /* 把token保存到sessionStorage中*/
        window.sessionStorage.setItem('token',res.data.token)
        this.$router.push('/home');
      });
    }
  }
};
</script>

<style lang="less" scoped>//less表示语法格式，scoped表示生效区间只在当前组件生效
.login_container{
  background-color: #2b4b6b;
  height:100%;

}

.login_box{
  width:450px;
  height:300px;
  background-color: #fff;
  border-redius:3px;
  // 将盒子置于父盒子正中间
  position:absolute;
  left:50%;
  top:50%;
  transform: translate(-50%,-50%);
  // 嵌套一个样式
  .avatar_box{
    height:130px;
    width:130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left:50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    img{
      width:100%;
      height:100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form{
  position: absolute;
  bottom: 0/* 距离底部对齐 */;
  width:100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns{
  display:flex;
  justify-content: flex-end;
}
</style>
