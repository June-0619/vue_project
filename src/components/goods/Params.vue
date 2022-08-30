<template>
  <div>
    <!-- 面包屑导航区域-->
     <el-breadcrumb separator-class="el-icon-arrow-right">
       <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
       <el-breadcrumb-item>商品管理</el-breadcrumb-item>
       <el-breadcrumb-item>参数列表</el-breadcrumb-item>
     </el-breadcrumb>
     <!-- 卡片视图区域-->
     <el-card>
        <!-- 警告区域-->
        <!-- 布尔值的属性绑定要记得加冒号-->
         <el-alert
           title="注意: 只允许为第三级分类设置相关参数!"
           type="warning" :closable="false"
           show-icon>
         </el-alert>
        <!-- 选择商品分类区域-->
         <el-row class="cat_opt">
           <el-col>
             <span>选择商品的分类：</span>
             <!-- 选择商品分类的级联选择框-->
               <el-cascader
                 v-model="selectedCateKeys"
                 :options="catelist"
                 expandTrigger= "hover"
                 :props="cateProps"
                 @change="handleChange">
               </el-cascader>
           </el-col>
         </el-row>
         <!-- tab页签区域-->
         <el-tabs v-model="activeName" @tab-click="handleTabClick">
           <!-- 添加动态参数面板-->
           <el-tab-pane label="动态参数" name="many">
             <!-- 添加参数的按钮-->
             <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
             <!-- 动态参数的表格-->
             <el-table :data="manyTableData" border stripe>
               <!-- 展开行-->
               <el-table-column type="expand">
                 <template slot-scope="scope">
                   <!-- 循环渲染tag标签-->
                   <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">
                     {{item}}
                   </el-tag>
                   <!-- 输入的文本框-->
                   <!-- v-if控制输入框和按钮的切换显示-->
                   <el-input
                     class="input-new-tag"
                     v-if="scope.row.inputVisible"
                     v-model="scope.row.inputValue"
                     ref="saveTagInput"
                     size="small"
                     @keyup.enter.native="handleInputConfirm(scope.row)"
                     @blur="handleInputConfirm(scope.row)"
                   >
                   </el-input>
                   <!--添加按钮 -->
                   <el-button v-else class="button-new-tag" size="small"
                   @click="showInput(scope.row)">+ New Tag</el-button>
                 </template>
               </el-table-column>
               <!-- 索引列-->
               <el-table-column type="index"></el-table-column>
               <el-table-column label="参数名称" prop="attr_name"></el-table-column>
               <el-table-column label="操作">
                 <template slot-scope="scope">
                   <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                   <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                 </template>
               </el-table-column>
             </el-table>
           </el-tab-pane>
           <!-- 添加静态属性面板-->
           <el-tab-pane label="静态属性" name="only">
             <!-- 添加属性的按钮-->
             <el-button type="primary" size="mini" :disabled="isBtnDisabled"  @click="addDialogVisible=true">添加属性</el-button>
             <!-- 静态属性表格-->
             <el-table :data="onlyTableData" border stripe>
               <!-- 展开行-->
               <el-table-column type="expand">
                 <template slot-scope="scope">
                   <!-- 循环渲染tag标签-->
                   <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">
                     {{item}}
                   </el-tag>
                   <!-- 输入的文本框-->
                   <!-- v-if控制输入框和按钮的切换显示-->
                   <el-input
                     class="input-new-tag"
                     v-if="scope.row.inputVisible"
                     v-model="scope.row.inputValue"
                     ref="saveTagInput"
                     size="small"
                     @keyup.enter.native="handleInputConfirm(scope.row)"
                     @blur="handleInputConfirm(scope.row)"
                   >
                   </el-input>
                   <!--添加按钮 -->
                   <el-button v-else class="button-new-tag" size="small"
                   @click="showInput(scope.row)">+ New Tag</el-button>
                 </template>
               </el-table-column>
               <!-- 索引列-->
               <el-table-column type="index"></el-table-column>
               <el-table-column label="属性名称" prop="attr_name"></el-table-column>
               <el-table-column label="操作">
                 <template slot-scope="scope">
                   <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                   <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                 </template>
               </el-table-column>
             </el-table>
           </el-tab-pane>
         </el-tabs>
     </el-card>
     <!-- 添加参数的对话框-->
    <el-dialog
       :title="'添加'+titleText"
       :visible.sync="addDialogVisible"
       width="50%" @close="addDialogCLosed">
       <!-- 添加参数的表单-->
       <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
         <el-form-item :label="titleText" prop="attr_name">
           <el-input v-model="addForm.attr_name"></el-input>
         </el-form-item>
       </el-form>
       <span slot="footer" class="dialog-footer">
         <el-button @click="addDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="addParams">确 定</el-button>
       </span>
     </el-dialog>
     <!-- 修改参数的对话框-->
    <el-dialog
       :title="'修改'+titleText"
       :visible.sync="editDialogVisible"
       width="50%" @close="editDialogCLosed">
       <!-- 修改参数的表单-->
       <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
         <el-form-item :label="titleText" prop="attr_name">
           <el-input v-model="editForm.attr_name"></el-input>
         </el-form-item>
       </el-form>
       <span slot="footer" class="dialog-footer">
         <el-button @click="editDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="editParams">确 定</el-button>
       </span>
     </el-dialog>

  </div>
</template>

<script>
export default{
  data(){
    return {
      //商品分类列表
      catelist:[],
      //级联选择框的配置对象
      cateProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      //级联选择框双向绑定到的数组
      selectedCateKeys:[],
      //被激活的页签名称
      activeName:'many',
      //动态参数的数据
      manyTableData:[],
      //静态属性的数据
      onlyTableData:[],
      //控制添加对话框的显示与隐藏
      addDialogVisible:false,
      //添加参数的表单数据
      addForm:{
        attr_name:''
      },
      //添加表单的验证规则对象
      addFormRules:{
        attr_name:[{required:true,message:'请输入参数名称',trigger:'blur'},]
      },
      //控制修改对话框的显示与隐藏
      editDialogVisible:false,
      //修改的表单数据
      editForm:{},
      //修改表单的验证规则对象
      editFormRules:{
        attr_name:[{required:true,message:'请输入参数名称',trigger:'blur'},]
      },
      //控制按钮与文本框的切换显示
      inputVisible:false,
      //文本框中输入的内容
      inputValue:'',
    }
  },
  created(){
    this.getCatelist()
  },
  methods:{
    //获取所有的商品分类列表
    async getCatelist(){
      const {data:res}=await this.$http.get('categories')
      if(res.meta.status!==200){
        return this.$message.error('获取商品分类失败！')
      }
      this.catelist=res.data
      // console.log(this.catelist)
    },
    //级联选择框选中项变化触发
    handleChange(){
      this.getParamsData()
    },
    //tab页签点击事件的处理
    handleTabClick(){
      console.log(this.activeName)
      this.getParamsData()
    },
    async getParamsData(){
      // 若选中的不是三级分类
      if(this.selectedCateKeys.length!==3){
        this.selectedCateKeys=[]
        this.manyTableData=[]
        this.onlyTableData=[]
        return
      }
      //若选中的为三级分类
      console.log(this.selectedCateKeys)
      //根据所选分类的id和当前所处的面板来获取对应的参数
      const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
      if(res.meta.status!==200){
        return this.$message.error('获取参数列表失败！')
      }
      //对于每行数据，将attr_vals字符串转为数组
      res.data.forEach(item=>{
        //若为空直接返回空数组，不拼接
        if(!item.attr_vals) item.attr_vals=[]
        else{
          item.attr_vals=item.attr_vals.split(',')
        }
        //逐行绑定数据
        //控制文本框的显示与隐藏
        item.inputVisible=false
        //文本框中输入的值
        item.inputValue=''
      })
      // console.log(res.data)
      if(this.activeName==='many'){
        this.manyTableData=res.data
      }else{
        this.onlyTableData=res.data
      }
    },
    //监听添加对话框的关闭事件
    addDialogCLosed(){
      this.$refs.addFormRef.resetFields()
    },
    //点击按钮，添加参数
    addParams(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid) return
        const {data:res}=await this.$http.post(`categories/${this.cateId}/attributes`,{
          attr_name:this.addForm.attr_name,
          attr_sel:this.activeName
        })

        if(res.meta.status!==201){
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功！')
        //刷新
        this.getParamsData()
        this.addDialogVisible=false
      })
    },
    //点击按钮，展示修改对话框
    async showEditDialog(attr_id){
      this.editDialogVisible=true
      //查询当前参数的信息
      const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,
      {params:{attr_sel:this.activeName}})
      if(res.meta.status!==200){
        return this.$message.error('获取参数信息失败！')
      }
      //数据存放在表单中
      this.editForm=res.data
    },
    //重置修改的表单
    editDialogCLosed(){
      this.$refs.editFormRef.resetFields()
    },
    //点击按钮，修改参数信息
    editParams(){
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid) return
        const {data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
          attr_name:this.editForm.attr_name,
          attr_sel:this.activeName
        })
        if(res.meta.status!==200){
          return this.$message.error('修改参数失败！')
        }
        this.$message.success('修改参数成功！')
        //刷新
        this.getParamsData()
        this.editDialogVisible=false
      })
    },
    //根据id删除对应的参数项
    async removeParams(attr_id){
      const confirmResult=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err=>err)
      //用户取消删除操作
      if(confirmResult!=='confirm'){
        return this.$message.info('已取消删除！')
      }
      const {data:res}=await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
      if(res.meta.status!==200){
        return this.$message.error('删除参数失败！')
      }
      this.$message.success('删除参数成功！')
      //刷新
      this.getParamsData()
    },
    //文本框失去焦点或按下enter键
    async handleInputConfirm(row){
      //用户未输入或只输入了空格，文本框失焦后直接置空
      if(row.inputValue.trim().length===0){
        row.inputValue=''
        row.inputVisible=false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      //文本框清空
      row.inputValue=''
      //文本框隐藏
      row.inputVisible=false
      this.saveAttrvals(row)
    },
    //将对attr_vals的操作，保存到数据库
    async saveAttrvals(row){
      //发起请求，保存此次操作
      const {data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(',')//转换回字符串
      })
      if(res.meta.status!==200){
        return this.$message.error('修改参数项失败！')
      }
      this.$message.success('修改参数项成功！')
    },
    //点击按钮，展示文本输入框
    showInput(row){
      row.inputVisible=true
      //让文本框自动获得焦点
      //$nextTick方法作用：当页面上的元素被重新渲染之后，才会执行回调函数的代码
      //因为将row.inputVisible重置为true时，实际上元素还未被重新渲染，依然是button
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //删除对应的参数可选项
    handleClose(i,row){
      row.attr_vals.splice(i,1)
      this.saveAttrvals(row)
    },
  },
  computed:{
    //如果按钮需要被禁用，则返回true,否则返回false
    isBtnDisabled(){
      if(this.selectedCateKeys.length!==3){
        return true
      }
      return false
    },
    //当前选中的三级分类的id
    cateId(){
      if(this.selectedCateKeys.length===3){
        return this.selectedCateKeys[2]
      }
      return null
    },
    //动态计算标题的文本
    titleText(){
      if(this.activeName==='many'){
        return '动态参数'
      }
      return '静态属性'
    },
  }
}
</script>

<style lang="less" scoped>
.cat_opt{
  margin:15px 0;
}
.el-tag{
  margin:10px;
}
.input-new-tag{
  width:120px;
}
</style>
