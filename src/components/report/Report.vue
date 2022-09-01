<template>
  <div>
    <!-- 面包屑导航区域-->
     <el-breadcrumb separator-class="el-icon-arrow-right">
       <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
       <el-breadcrumb-item>数据统计</el-breadcrumb-item>
       <el-breadcrumb-item>数据报表</el-breadcrumb-item>
     </el-breadcrumb>
     <!-- 卡片试图区域-->
     <el-card>
       <div id="main" style="width: 750px;height:400px;"></div>
     </el-card>
  </div>
</template>

<script>
//导入echarts
import * as echarts from 'echarts';

export default{
  data(){
    return{
      // 指定图表的配置项和数据
      options: {
              title: {
                text: '用户来源'
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: {
                    backgroundColor: '#E9EEF3'
                  }
                }
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: [
                {
                  boundaryGap: false
                }
              ],
              yAxis: [
                {
                  type: 'value'
                }
              ]
            },
    }
  },
  created(){

  },
  //dom元素被渲染完毕后执行mounted函数
  async mounted(){
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    //接收图表数据
    const {data:res}=await this.$http.get('reports/type/1')
    if(res.meta.status!==200){
      return this.$message.error('获取折线图数据失败！')
    }
    //合并options和接收到的图表数据
    const result={...this.options,...res.data}

    myChart.setOption(result);

  },
  methods:{}

}
</script>

<style lang="less" scoped>
</style>
