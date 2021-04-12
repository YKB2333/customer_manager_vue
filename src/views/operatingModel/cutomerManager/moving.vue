<template>
  <div>
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
      <!-- 插槽内容 -->
      <div slot="before-table">
        <div class="tableTop">
          <div>
            <span>制定部门</span>{{query.companyName+'-'+query.deptName}}
          </div>
          <el-button type="primary" @click="add">添加行动计划</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
      >
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="projectName" label="项目名称"></el-table-column>
        <el-table-column prop="personInCharge" label="负责人"></el-table-column>
        <el-table-column prop="projectStartupTime" label="项目启动时间">
          <template slot-scope="scope">
              <span>{{$formatDate(scope.row.projectStartupTime,'Y/M/D')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="target" label="项目目标"></el-table-column>
        <el-table-column prop="state" label="状态">
          <template slot-scope="scope">
              <span>{{scope.row.state == '1'?'未完结':'完结'}}</span>
          </template>
        </el-table-column>
      <!--  <el-table-column label="附件">
          <template slot-scope="scope">
            <el-tag class="pointer" @click="showAttaDialog(scope.row)">{{ scope.row.attaNum}}</el-tag>
          </template>
        </el-table-column>-->
        <el-table-column width="300px" prop="" label="项目进展">
          <template slot-scope="scope">
            <div v-for="item in scope.row.speads" :key="item.id">
                <span>{{$formatDate(item.speadTime,'Y-M-D')}}</span>：
                <span>{{item.speadTarget}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" :disabled="scope.row.state == '2'" @click="edit(scope.row, scope.$index)">编辑</el-button>
            <el-button type="text" :disabled="scope.row.state == '2'" @click="del(scope.row, scope.$index)">删除</el-button>
            <el-button type="text" :disabled="scope.row.state == '2'" @click="end(scope.row, scope.$index)">完结</el-button>
            <el-button type="text" :disabled="scope.row.state == '2'" @click="showProject(scope.row, scope.$index)">项目进展</el-button>
          </template>
        </el-table-column>
      </el-table>
    </my-table>
    <!-- 弹窗 -->
    <my-dialog
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :title="dialogTitle"
      width="540px"
      max-height
      @close="closeDialog"
    >
      <el-form :model="saveForm" ref="saveForm" :label-width="labelWidth" inline>
        <div>
          <el-form-item label="项目名称">
            <el-input v-model="saveForm.projectName" placeholder="请输入项目名称" :style="inputStyle"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="项目启动时间">
           <el-date-picker
              v-model="saveForm.projectStartupTime"
              type="date"
              placeholder="选择时间"
              value-format="timestamp"
              :style="inputStyle"
            ></el-date-picker>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="目标">
            <el-input v-model="saveForm.target" placeholder="请输入目标" :style="inputStyle"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="负责人">
            <el-input v-model="saveForm.personInCharge" placeholder="请输入负责人" :style="inputStyle"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="上传附件" prop="agreementAtta">
            <file-list
              v-if="dialogVisible"
              v-model="saveForm.attas"
              async
              :uploadOss="uploadContractAtta"
              :removePromise="delAtta"
              :uploadPromise="addAtta"
            ></file-list>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="align-center">
        <el-button type="primary" :loading="saveBtnLoading" @click="submit">保 存</el-button>
        <el-button @click="closeDialog">关 闭</el-button>
      </div>
    </my-dialog>
    <my-dialog
      v-model="dialogVisiblePro"
      :close-on-click-modal="false"
      title="项目进展"
      width="800px"
      max-height
      @close="closeDialogPro"
    >
      <el-table class="mt10" :data="projectList">
       <!-- <div slot="append" >
          <el-button type="primary" icon="el-icon-plus" @click="clearPro('shopInfo')" size="small"  style="width:100%">请添加竞品分析</el-button>
        </div>-->
        <el-table-column label="序号" width="60">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="选择时间" >
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.speadTime"
              type="date"
              :disabled="true"
              placeholder="选择时间"
              value-format="timestamp"
            ></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="进展情况" >
          <template slot-scope="scope">
            <el-input :disabled="true" v-model="scope.row.speadTarget" placeholder="请输入进展情况"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="操作" width="100px" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="editCoreSupInfo(scope),isEditCoreSup=true" >修改</el-button>
            <el-button type="text" @click="delCoreSupInfo(scope.row)" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" icon="el-icon-plus" @click="clearPro" size="small"  style="width:100%">请添加项目进展</el-button>
      <!-- <span slot="footer" class="dialog-footer"> -->
      <div slot="footer" style="text-align:right;margin-top:20px;">
        <el-button @click="closeDialogPro">关 闭</el-button>
      </div>
      <!-- </span> -->
    </my-dialog>
    <el-dialog
      :title="isEditCoreSup ? '修改项目进展' : '项目进展'"
      :visible.sync="shopInfoFlag"
      width="60%"
      :before-close="shopInfoClose">
      <el-table class="mt10" :data="shopInfoList" >
        <el-table-column prop="date" label="选择时间" >
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.speadTime"
              type="date"
              placeholder="选择时间"
              value-format="timestamp"
            ></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="进展情况" >
          <template slot-scope="scope">
            <el-input v-model="scope.row.speadTarget" placeholder="请输入进展情况"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shopInfoFlag = false">取 消</el-button>
        <el-button type="primary" @click="addCooInfo"> {{ isEditCoreSup ? '修 改' : '添 加'}}</el-button>
      </span>
    </el-dialog>
    <!--附件上传-->
    <my-dialog title="附件列表" v-model="attaDialogVisible" @close="closeAttaDialog">
      <file-list
        v-if="attaDialogVisible"
        v-model="attaList"
        :uploadOss="uploadContractAtta"
        async
        :removePromise="delAtta"
        :uploadPromise="addAtta"
      ></file-list>
    </my-dialog>
  </div>
</template>

<script>
import {
    movingList,
    addMoving,
    updateMoving,
    delMoving,
    ruleUpdate,
    movingAttaList,
    addMovingAtta,
    delMovingAtta,
    endApi,
    movingProjectList,
    addMovingProject,
    updateMovingProject,
    delMovingProject
} from "@/api/operatingModel";
import { getAllBaseInfoList } from "@/api/baseInfo";
import {getAllCompanyInfo} from '@/api/client'
import {deepClone} from '@/utils'
import { uploadContractAtta, uploadGoodsImages } from "@/api/uploadOss";
export default {
  name: "moving",
  components: {},
  data() {
    return {
      proId:'',
      isEditCoreSup:false,
      shopInfoFlag:false,
      shopInfoList:[{
        actionId:'',
        speadTarget:'',
        speadTime:''
      }],
      projectList:[{
        speadTarget:'',
        speadTime:''
      }],
      dialogTitle:'',
      query:{},
      baseInfoData: [],
      departments:[],//所属公司
      defaultParams: {
        label: '_fullname',
        value: '_departmentid',
        children: 'departmentBeanList',
      },
      labelWidth: "120px",
      inputStyle: { width: "260px" },
      searchForm: [
        {
          key: "baseInfoName",
          placeholder: "请输入客户名称",
          type: "input"
        },
      ],
      saveFormPro:{},

      searchQuery: {
        baseInfoId: "",
        pageIndex: 1,
        pageSize: 10,
        total: 0 // 总条数
      },
      tableLoading: false,
      tableData: [], // 表格数据
      dialogVisible: false,
      dialogVisiblePro:false,
      saveBtnLoading: false, // 保存按钮的loading状态
      saveForm: {
        personInCharge: null,
        projectName:null,
        projectStartupTime: null,
        target: null,
        yearTargetId: null,
        attas:[],
      },
      companyInfo:[],
      currentRow: null,
      attaDialogVisible: false,
      attaList: [],

    };
  },
  created() {
    if(this.$route.query && this.$route.query.id){
      this.query = this.$route.query
      this.fetchTableData();
      this.fetchBaseInfoData();
      this.getCompanyInfo()
    }else{
      this.$message.warning('获取参数失败');
      this.$router.push({name:'strategic'})
    }
  },
  methods: {
    delCoreSupInfo(item){
      this.$confirm(`确认删除吗？`)
        .then(_ => {
          this.$loading({ fullscreen: true })
          delMovingProject(item.id).then(res=>{
            movingProjectList(this.proId).then(res=>{
              this.projectList = res
            })
            this.$loading().close();
            this.$message({message: '删除成功',type: 'success'});
          }).catch(err=>{
            this.$loading().close();
          })
        })
    },
    editCoreSupInfo(item){
      item.row["id"] += ""
      item.row["actionId"] += ""
      let copy = deepClone(item.row)
      this.shopInfoList = [copy];
      this.shopInfoFlag = !this.shopInfoFlag;
      this.isEditCoreSup = true; // 弹窗时修改的状态
    },
    addCooInfo(){
      if(this.isEditCoreSup){
        updateMovingProject(this.shopInfoList[0]).then(res=>{
          this.$message({ message: '修改项目进展成功',type: 'success'});
          movingProjectList(this.proId).then(res=>{
            this.projectList = res
          })
          this.shopInfoFlag = !this.shopInfoFlag;
        })
        return
      }else{
        this.shopInfoList[0].actionId = this.proId
        addMovingProject(this.shopInfoList[0]).then(res=>{
          this.$message({ message: '添加项目进展成功',type: 'success'});
          movingProjectList(this.proId).then(res=>{
            this.projectList = res
          })
          this.shopInfoFlag = !this.shopInfoFlag;
        })
      }
    },
    shopInfoClose(done) {
      done();
    },
    clearPro(){
      this.shopInfoList[0]["actionId"] = '';
      this.shopInfoList[0]["speadTarget"] = '';
      this.shopInfoList[0]["speadTime"] = '';
      this.isEditCoreSup = false;
      this.shopInfoFlag = true;
    },
    fetchBaseInfoData() {
      return getAllBaseInfoList().then(res => {
        this.baseInfoData = res;
      });
    },
    getCompanyInfo(){
      getAllCompanyInfo().then(
          res=>{
            let data = deepClone(res)
            data.forEach(ele => {
              ele['_departmentid'] = ele._subcompanyid
            });
            this.departments = data
            console.log("departments",this.departments)
          }
        )
    },
    selectSign(data){
      this.$nextTick(()=>{
        this.saveForm.signSubject = this.$refs.selectRef.selected.label
      })
    },
    uploadContractAtta,
    uploadGoodsImages,
    onChange() {
      this.fetchTableData();
    },
    // 加载表格数据
    fetchTableData() {
      this.tableLoading = true;
      this.searchQuery.yearTargetId = this.query.id
      return movingList(this.searchQuery)
        .then(res => {
          this.searchQuery.total = res.total; // 总条数
          res.records.forEach(r => {
            r.baseInfoId += "";
          });
          this.tableData = res.records;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    add() {
      this.dialogTitle = '新增'
      this.dialogVisible = true;
    },
    showProject(row){
      this.dialogVisiblePro = true
      this.proId = row.id
      movingProjectList(this.proId).then(
        res=>{
          this.projectList=res;
        }
      )
    },
    edit(item) {
      this.dialogTitle = '编辑'
      this.saveForm = this.$lodash.cloneDeep(item);
      this.dialogVisible = true;
    },
    end(row){
      this.$confirm("确认完结 "+row.projectName+' 吗', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        endApi(row.id + "").then(res => {
          this.$message.success("操作成功");
          this.fetchTableData();
        });
      });
    },
    // 保存提交
    submit() {
      this.saveForm.yearTargetId = this.query.id
      if(this.saveForm && this.saveForm.attas.length == 0){
        this.$message.warning('附件不能为空')
        return
      }
      // this.saveBtnLoading = true;
      if(this.saveForm.projectName){
        if(this.dialogTitle == '新增'){
          addMoving(this.saveForm)
          .then(res => {
            this.$message.success("添加成功");
            this.fetchTableData();
            this.closeDialog();
          })
          .finally(() => {
            this.saveBtnLoading = false;
          });
        }else{
          updateMoving(this.saveForm)
            .then(res => {
              this.$message.success("添加成功");
              this.fetchTableData();
              this.closeDialog();
            })
            .finally(() => {
              this.saveBtnLoading = false;
            });
        }
      }else{
        this.$message.warning('请选择项目名称');
        return
      }
    },
    submitPro(){

    },
    closeDialog() {
      this.saveForm = {};
      this.dialogVisible = false;
    },
    closeDialogPro(){
      this.saveFormPro = {};
      this.dialogVisiblePro = false;
      this.fetchTableData();
    },
    del(item, index) {
      this.$confirm("确认删除 "+item.projectName+" 吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delMoving(item.id + "").then(res => {
          this.$message.success("删除成功");
          this.fetchTableData();
        });
      });
    },
    showAttaDialog(row) {
      movingAttaList(row.id).then(res => {
        res.forEach(r => {
          r.id += "";
        });
        this.currentRow = row;
        this.attaList = res;
        this.attaDialogVisible = true;
      });
    },
    closeAttaDialog() {
      this.currentRow = null;
      this.attaList = [];
      this.attaDialogVisible = false;
      this.fetchTableData();
    },
    delAtta(atta) {
      return new Promise((resolve, reject) => {
        this.$confirm("确认删除", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.saveForm.attas.forEach((item,index)=>{
            if(item.attaUrl == atta.attaUrl){
              this.saveForm.attas.splice(index,1)
              resolve(this.saveForm.attas);
            }
          })
        }).catch((e)=>{
          reject(e)
        })
      });
    },
    addAtta(atta) {
      this.saveForm.attas.push(atta)
    },
  }
};
</script>
<style lang="scss" scoped>
.tableTop{
  display: flex;
  color:#606662;
  justify-content: space-between;
  // background: #fff;
  align-items: center;
  margin-bottom: 10px;
  padding:6px;
  padding-left:22px;
  border-radius: 4px;
  span{
    font-weight: bold;
    margin-right: 20px;
  }
}
</style>
