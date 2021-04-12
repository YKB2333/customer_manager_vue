<template>
  <div>
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
      <!-- 插槽内容 -->
      <div slot="before-table">
        <div class="pb10">
          <el-button v-permission-button="'add'" type="primary" @click="add">新增</el-button>
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
        <el-table-column prop="baseInfoName" label="客户名称"></el-table-column>
        <el-table-column prop="deptName" label="制定部门">
          <template slot-scope="scope">
            <span>{{scope.row.companyName+'-'+scope.row.deptName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="salesTarget" label="销售目标"></el-table-column>
        <el-table-column prop="breachSalesTarget" label="突破品类/品牌及销售目标"></el-table-column>
        <el-table-column prop="productSelectionStrategr" label="选品策略"></el-table-column>
<!--        <el-table-column label="行动计划上传">
          <template slot-scope="scope">
            <el-tag class="pointer" @click="showAttaDialog(scope.row)">{{ scope.row.attaNum}}</el-tag>
          </template>
        </el-table-column>-->
        <el-table-column label="操作" width="280" fixed="right">
          <template slot-scope="scope">
            <el-button v-permission-button="'edit'" type="text" @click="edit(scope.row, scope.$index)">编辑</el-button>
            <el-button v-permission-button="'delete'" type="text" @click="del(scope.row, scope.$index)">删除</el-button>
           <!-- <el-button v-permission-button="'upload'" type="text" @click="showAttaDialog(scope.row)">上传附件</el-button>-->
            <!-- <el-button v-permission-button="'planManagement'" type="text" @click="$router.push({name:'moving',query:scope.row})">行动计划管理</el-button> -->
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
          <el-form-item label="客户" prop="baseInfoId">
          <el-select
            v-model="saveForm.baseInfoId"
            filterable
            placeholder="请选择客户"
            :style="inputStyle"
          >
            <el-option
              v-for="(item, index) in baseInfoData"
              :key="index"
              :label="item.name"
              :value="item.baseInfoId"
            ></el-option>
          </el-select>
        </el-form-item>
          <el-form-item label="制定部门">
          <el-cascader
            ref="cas"
            :style="inputStyle"
            :props="defaultParams"
            :options="departments"
            v-model="saveForm.deptIds"
            @change="onChangeCas"
            ></el-cascader>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="销售目标">
            <el-input v-model="saveForm.salesTarget" placeholder="请输入销售目标" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" :style="inputStyle"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="突破品类/品牌及销售目标">
           <el-input type="textarea" v-model="saveForm.breachSalesTarget" placeholder="请输入突破品类/品牌及销售目标" :style="inputStyle"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="选品策略">
            <el-input type="textarea" v-model="saveForm.productSelectionStrategr" placeholder="请输入选品策略" :style="inputStyle"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="目标达成的行动计划" prop="agreementAtta">
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
    <!--附件上传-->
   <!-- <my-dialog title="附件列表" v-model="attaDialogVisible" @close="closeAttaDialog">
      <file-list
        v-if="attaDialogVisible"
        v-model="attaList"
        :uploadOss="uploadContractAtta"
        async
        :removePromise="delAtta"
        :uploadPromise="addAtta"
      ></file-list>
    </my-dialog>-->
  </div>
</template>

<script>
import {
    strategicList,
    strategicSave,
    strategicUpdate,
    delStrategic,
    getStrategicAtta,
    addStrategicAtta,
    delStrategicAtta
} from "@/api/operatingModel";
import { getAllBaseInfoList } from "@/api/baseInfo";
import {getAllCompanyInfo} from '@/api/client'
import {deepClone} from '@/utils'
import { uploadContractAtta, uploadGoodsImages } from "@/api/uploadOss";
export default {
  name: "agreement",
  components: {},
  data() {
    return {
      dialogTitle:'',
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
      searchQuery: {
        baseInfoId: "",
        pageIndex: 1,
        pageSize: 10,
        total: 0 // 总条数
      },
      tableLoading: false,
      tableData: [], // 表格数据
      dialogVisible: false,
      saveBtnLoading: false, // 保存按钮的loading状态
      saveForm: {
        salesTarget: null,
        baseInfoId:null,
        productSelectionStrategr: null,
        deptName: null,
        deptId: null,
        companyId:null,
        breachSalesTarget: null,
        baseInfoName: null,
        attas:[],
      },
      companyInfo:[],
      currentRow: null,
      attaDialogVisible: false,
      //attaList: []
    };
  },
  async created() {
    await this.fetchTableData();
    this.fetchBaseInfoData();
    this.getCompanyInfo()
  },
  methods: {
    onChangeCas(e) {
      // this.$nextTick(()=>{
      //   console.log(this.$refs.cas.getCheckedNodes())
      // })
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
      return strategicList(this.searchQuery)
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
      this.dialogTitle = '新增';
      this.dialogVisible = true;
    },
    edit(item) {
      this.dialogTitle = '编辑';
      this.saveForm = this.$lodash.cloneDeep(item);
      this.dialogVisible = true;
      this.saveForm.deptIds = []
      this.saveForm.deptIds.push(item.companyId+"",item.deptId+"")
        // item.deptIds = []
        // item.deptIds.push()
        // item.deptIds.push(item.deptId+"")
      console.log(this.saveForm);
    },
    // 保存提交
    submit() {
      //console.log(this.saveForm)
        // this.saveBtnLoading = true;
      if(this.saveForm && this.saveForm.attas.length == 0){
        this.$message.warning('附件不能为空')
        return
      }
        if(this.saveForm.deptIds && this.saveForm.deptIds.length>0){
          this.saveForm.deptId = this.saveForm.deptIds[1]
          this.saveForm.companyId = this.saveForm.deptIds[0]
          // strategicUpdate
          if(this.dialogTitle == '新增'){
            strategicSave(this.saveForm)
            .then(res => {
              this.$message.success("添加成功");
              this.fetchTableData();
              this.closeDialog();
              this.saveForm.attas = []
            })
            .finally(() => {
              this.saveBtnLoading = false;
            });
          }else{
            strategicUpdate(this.saveForm)
            .then(res => {
              this.$message.success("更新成功");
              this.fetchTableData();
              this.closeDialog();
              this.saveForm.attas = []
            })
            .finally(() => {
              this.saveBtnLoading = false;
            });
          }
        }else{
          this.$message.warning('请选择制定部门');
          return
        }
    },
    closeDialog() {
      this.saveForm = {};
      this.dialogVisible = false;
    },
    del(item, index) {
      this.$confirm("确认删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delStrategic(item.id + "").then(res => {
          this.$message.success("删除成功");
          this.fetchTableData();
        });
      });
    },
    showAttaDialog(row) {
      getStrategicAtta(row.id).then(res => {
        res.forEach(r => {
          r.id += "";
        });
        this.currentRow = row;
        //this.attaList = res;
        this.attaDialogVisible = true;
      });
    },
    closeAttaDialog() {
      this.currentRow = null;
      //this.attaList = [];
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
      console.log(atta)
      this.saveForm.attas.push(atta)
      console.log("2",atta)
    },
  }
};
</script>
