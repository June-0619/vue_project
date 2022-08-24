<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click=logout>退出</el-button>
    </el-header>
    <!-- 页面主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-buttton"  @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
              background-color="#333744"
              text-color="#fff"
              active-text-color="#409eff"
              unique-opened
              :collapse="isCollapse"
              :collapse-transition="false"
              router
              :default-active="activePath"
              ><!-- 由于要保证值为布尔值而不是普通字符串，所以要使用属性绑定 -->
              <!-- 一级菜单 -->
              <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id"><!-- 有几个菜单项，通过index来区分不同项 -->
                <!-- 一级菜单的模板区域 -->
                <template slot="title">
                  <!-- 图标 -->
                  <i :class="iconsObj[item.id]"></i>
                  <!-- 文本 -->
                  <span>{{item.authName}}</span><!-- 获取菜单名 -->
                </template>


                <!-- 二级菜单 -->
                <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
                  <!-- 二级菜单的模板区域 -->
                  <template slot="title">
                    <!-- 图标 -->
                    <i class="el-icon-menu"></i>
                    <!-- 文本 -->
                    <span>{{subItem.authName}}</span>
                  </template>

                </el-menu-item>

              </el-submenu>
            </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>

      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default{
  data(){
    return{
      //将获取到的左侧菜单数据保存在 menulist中
      menulist:[],
      iconsObj:{/* 使用id对应类名 */
        '125':'iconfont icon-users',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao'
      },
      //是否折叠
      isCollapse:false,
      //被激活的链接地址
      activePath:''
    }
  },
  created() {
    this.getMenuList()
    this.activePath=window.sessionStorage.getItem('activePath');
  },
  methods:{
    logout(){
      window.sessionStorage.clear();
      this.$router.push('/login');
    },
    //获取所有的菜单
    async getMenuList(){
      const {data:res}=await this.$http.get('menus')//路径是从api文件中获得
      //获取菜单失败
      if(res.meta.status!==200) return this.$message.error(res.meta.msg)
      //获取成功
      this.menulist=res.data
      console.log(res)
    },
    //点击按钮，切换菜单的折叠与展开
    toggleCollapse(){
      this.isCollapse=!this.isCollapse
    },
    //保存选中菜单的对应链接的激活状态
    saveNavState(activePath){
      //在sessionStorage中新建一个属性activePath
      window.sessionStorage.setItem('activePath',activePath)
      //修改data中activePath的值
      this.activePath=activePath
    }
  }
};
</script>

<style lang="less" scoped>
  /* element的组件名称就为它的类名*/
.home-container{
  height:100%;
}
.el-header{
  background-color: #373d41;
  display:flex;
  justify-content: space-between;//header中的组件左右贴边
  padding-left: 0;
  align-items: center;//buttom垂直居中
  color:#fff;//字体色号
  font-size:20px;
  /* 嵌套*/
  >div{
    display: flex;
    align-items: center;//使得文字垂直居中
    span{
      margin-left: 15px;
    }
  }

}
.el-aside{
  background-color: #333744;
}
.el-main{
  background-color: #eaedf1;
}

.iconfont{
  margin-right: 10px;
}

.el-menu{
  border-right: 0;
}

.toggle-buttton{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
}

</style>
