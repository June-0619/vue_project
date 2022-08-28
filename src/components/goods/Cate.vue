<template>
  <div>
    <!-- 面包屑导航区域-->
     <el-breadcrumb separator-class="el-icon-arrow-right">
       <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
       <el-breadcrumb-item>商品管理</el-breadcrumb-item>
       <el-breadcrumb-item>商品分类</el-breadcrumb-item>
     </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域-->
      <tree-table class="treeTable" :data="catelist" :columns="columns"
      :selection-type="false" :expand-type="false"
      show-index index-text="#" border
      :show-row-hover="false">
        <!-- 是否有效-->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false"
          style="color:lightgreen;"></i>
          <i class="el-icon-error" v-else style="color:red;"></i>
        </template>
        <!--排序-->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!--操作-->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

    </el-card>
    <!-- 添加分类的对话框-->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed">
      <!-- 添加分类的表单-->
      <el-form ref="addCateFormRef" :model="addCateForm" :rules="addCateFormRules" label-width="100px">
        <el-form-item label="分类名称: " prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类: ">
            <!-- options用来指定数据源,props用来指定配置对象,v-model将选中的值双向绑定到数组中-->
            <el-cascader
              expandTrigger= "hover"
              v-model="selectKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChanged"
              clearable >
            </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
export default{
  data(){
   return {
     //查询条件
     querInfo:{
       type:3,
       pagenum:1,
       pagesize:5
     },
     //商品分类的数据列表
     catelist:[],
     //总数据条数
     total:0,
     //为table指定列的定义
     columns:[
       {
       label:'分类名称',
       prop:'cat_name'
     },{
       label:'是否有效',
       //将当前列定义为模板列
       type:'template',
       //表示当前这一列使用的模板名称
       template:'isok'
     },{
       label:'排序',
       //将当前列定义为模板列
       type:'template',
       //表示当前这一列使用的模板名称
       template:'order'
     },{
       label:'操作',
       //将当前列定义为模板列
       type:'template',
       //表示当前这一列使用的模板名称
       template:'opt'
     }
     ],
     //控制添加分类对话框的显示与隐藏
     addCateDialogVisible:false,
     //添加分类的表单数据对象
     addCateForm:{
       //将要添加的分类名称
       cat_name:'',
       //父级分类的id
       cat_pid:0,
       //当前分类的等级,默认要添加的是一级分类
       cat_level:0
     },
     //添加分类表单的验证规则对象
     addCateFormRules:{
      cate_name:[
        {required:true,message:'请输入分类名称',trigger:'blur'}
      ]
     },
     //父级分类的列表
     parentCateList:[],
     //指定级联选择器的配置对象
     cascaderProps:{
       value:'cat_id',
       label:'cat_name',
       children:'children',
       checkStrictly:true
     },
     //选中的key值
     selectKeys:[],
   }
  },
  created(){
    this.getCatelist()
  },
  methods:{
    //获取商品分类数据
    async getCatelist(){
      const {data:res}=await this.$http.get('categories',{params:this.querInfo})
      if(res.meta.status!==200){
        return this.$message.error('获取商品分类失败！')
      }
      // console.log(res.data)
      //把数据列表赋值给catelist
      this.catelist=res.data.result
      //为总数据条数赋值
      this.total=res.data.total
    },
    //监听pagesize改变
    handleSizeChange(newSize){
      this.querInfo.pagesize=newSize
      //刷新
      this.getCatelist()
    },
    //监听pagenum的改变
    handleCurrentChange(newPage){
      this.querInfo.pagenum=newPage
      this.getCatelist()
    },
    //点击按钮，展示添加分类的对话框
    showAddCateDialog(){
      //先获取父级分类的数据列表
      this.getParentCateList()
      //展示出对话框
      this.addCateDialogVisible=true
    },
    //获取父级分类的数据列表
    async getParentCateList(){
      const {data:res}=await this.$http.get('categories',{params:{type:2}})
       if(res.meta.status!==200){
         return this.$message.error('获取父级分类数据失败！')
       }
       // console.log(data)
       this.parentCateList=res.data
    },
    //选择项发生发生变化触发
    parentCateChanged(){
      console.log(this.selectKeys)
      //如果selectKeys数据中的length大于0，证明选中了父级分类
      //反之，就说明没有选中任何父级分类
      if(this.selectKeys.length>0){
        //父级分类的id
        this.addCateForm.cat_pid=this.selectKeys[this.selectKeys.length-1]
        //为当前分类的等级赋值
        this.addCateForm.cat_level=this.selectKeys.length
        return
      }
      //如果未选中父元素
      else{
        this.addCateForm.cat_pid=0
        this.addCateForm.cat_level=0
      }
      // console.log(this.addCateForm)
    },
    //点击按钮，添加新的分类
    addCate(){
      //表单预验证
      this.$refs.addCateFormRef.validate(async valid=>{
        if(!valid) return
        const {data:res}=await this.$http.post('categories',this.addCateForm)
        if(res.meta.status!==201){
          return this.$message.error('添加分类失败!')
        }

        this.$message.success('添加分类成功！')
        //刷新
        this.getCatelist()
        //关闭对话框
        this.addCateDialogVisible=false
      })
      console.log(this.addCateForm)
    },
    //监听对话框的关闭事件，重置表单数据
    addCateDialogClosed(){
      this.$refs.addCateFormRef.resetFields()
      this.selectKeys=[]
      this.addCateForm.cat_level=0
      this.addCateForm.cat_pid=0
    },
  }
}
</script>

<style lang="less" scoped>
.treeTable{
  margin-top:15px;
}

.el-cascader{
	width:100%
}
</style>
